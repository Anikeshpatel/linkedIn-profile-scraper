
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
  if (request.action === "open") {
    console.log("Openning app");
    const isProfilePage = document.querySelector(
      ".profile-photo-edit__preview, .pv-top-card__photo"
    );
    const isCardRendered = document.querySelector(".appCard");
    if (isProfilePage && !isCardRendered) {
      renderAppCard();
    } else {
	  console.log("Not a profile Page");
	  alert('Not a Profile Page')
    }
  } else if (request.action === "profile") {
    startScraping();
  }
});

const startScraping = (endPoint = "http://localhost:3000/user") => {
  showLoading();
  const profile = {
    skills: [],
  };

  window.scroll({
    top: document.body.clientHeight,
    left: 0,
    behavior: "smooth",
  });

  setTimeout(() => {
    profile.Name = document
      .querySelector(".pv-top-card--list")
      .getElementsByTagName("li")[0]
      .textContent.trim();
    profile.Image = document.querySelector(
      ".profile-photo-edit__preview, .pv-top-card__photo"
    ).src;

    const hasAbout = document.querySelector(".pv-about__summary-text");
    profile.About = hasAbout ? hasAbout.textContent.trim() : "";

    const skillPanelBtn = document.querySelector(
      ".pv-profile-section__card-action-bar.pv-skills-section__additional-skills"
    );

    if (
      skillPanelBtn.getElementsByTagName("span")[0].textContent.trim() ===
      "Show more"
    ) {
      skillPanelBtn.click();
    }

    setTimeout(() => {
      let skillsView = document.querySelector("#skill-categories-expanded");
      for (let child of skillsView.children) {
        let category = child.getElementsByTagName("h3")[0].textContent.trim();
        let skills = [];
        for (let skill of child.getElementsByTagName("ol")[0].children) {
          skills.push(
            skill
              .querySelector(".pv-skill-category-entity__name-text")
              .textContent.trim()
          );
        }
        profile.skills.push({
          category,
          skills,
        });
      }

      document.querySelector("a[data-control-name=contact_see_more]").click();

      setTimeout(() => {
        const profileInfoView = document.querySelector(
          ".pv-profile-section__section-info.section-info"
        );
        for (let child of profileInfoView.children) {
          let title = child.getElementsByTagName("header")[0].innerText;
          for (let section of child.children) {
            if (
              (title === "Birthday" || title === "Phone") &&
              section.getElementsByTagName("span").length > 0
            ) {
              profile[title] = section.getElementsByTagName(
                "span"
              )[0].innerText;
            } else if (
              title === "Email" &&
              section.getElementsByTagName("a").length > 0
            ) {
              profile[title] = section.getElementsByTagName("a")[0].innerText;
            } else if (section.getElementsByTagName("a").length > 0) {
              profile[title] = section.getElementsByTagName("a")[0].href;
            }
          }
        }

        document.querySelector("button[data-test-modal-close-btn]").click();
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        console.log(profile);
        try {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open("POST", endPoint);
          xmlhttp.setRequestHeader("Content-Type", "application/json");
          xmlhttp.send(JSON.stringify(profile));
        } catch (error) {
		  console.error(error);
		  alert('Backend server is not active')
        }
        dismissLoading();
      }, 1000);
    }, 1000);
  }, 3000);
};

const spinnerTemplate = `
	<div class="sk-chase">
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
	</div>
`;

const showLoading = () => {
  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  backdrop.innerHTML = spinnerTemplate;
  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";
  document.querySelector("#extended-nav").style.position = "relative";
};

const dismissLoading = () => {
  document.querySelector(".backdrop").remove();
  document.body.style.overflow = "auto";
  document.querySelector("#extended-nav").style.position = "fixed";
};

const renderAppCard = () => {
  const cardTemplate = `
		<section class="main__container">
			<h1 align='center' class="logo">Send Profile</h1>
		</section>
	`;

  const container = document.querySelector(".pv-content__right-rail");
  const card = document.createElement("div");
  card.className = "appCard";
  card.innerHTML = cardTemplate;
  container.insertBefore(card, container.firstChild);

  const isValidateUrl = (url) => {
    var re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return re.test(String(url).toLowerCase());
  };

  const getInputElement = (type) => {
    const inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.placeholder = "Backend End-Point";
    inputElement.className = "input";
    return inputElement;
  };

  const getActionBtn = (text) => {
    const btn = document.createElement("a");
    btn.className = "btn";
    btn.appendChild(document.createTextNode(text));
    return btn;
  };

  const getStatusLabel = (text = "") => {
    const label = document.createElement("p");
    label.className = "label";
    label.appendChild(document.createTextNode(text));
    return label;
  };

  const status = {
    error: "Invalid Url",
    currect: "Currect",
  };

  // Element References
  const inputElement = getInputElement("email");
  const actionBtn = getActionBtn("Send");
  const label = getStatusLabel("");
  const mainContainer = document.querySelector(".main__container");
  const inputContainer = document.createElement("div");
  inputContainer.className = "input__container";

  // Appending all children to the container
  inputContainer.appendChild(inputElement);
  mainContainer.appendChild(inputContainer);
  mainContainer.appendChild(label);
  mainContainer.appendChild(document.createElement("br"));
  mainContainer.appendChild(document.createElement("br"));
  mainContainer.appendChild(actionBtn);

  const setButtonStatus = (status) => {
    if (status) {
      actionBtn.style.pointerEvents = "auto";
      actionBtn.style.opacity = 1;
    } else {
      actionBtn.style.pointerEvents = "none";
      actionBtn.style.opacity = 0.5;
    }
  };
  setButtonStatus(false);

  const validate = (url) => {
    if (isValidateUrl(url)) {
      inputContainer.classList.remove("invalid");
      label.innerText = "";
      inputContainer.classList.add("currect");
      setButtonStatus(true);
    } else if (url.length > 0) {
      inputContainer.classList.add("invalid");
      label.innerText = status.error;
      setButtonStatus(false);
    } else {
      inputContainer.classList.remove("currect");
      inputContainer.classList.remove("invalid");
      label.innerText = "";
      setButtonStatus(false);
    }
  };

  // Html Events Callbacks
  inputElement.onmouseover = (e) => {
    inputContainer.classList.add("hover");
  };

  inputElement.onmouseleave = (e) => {
    inputContainer.classList.remove("hover");
  };

  inputElement.oninput = (e) => {
    validate(e.target.value);
  };

  chrome.storage.sync.get(["endPoint"], (result) => {
    inputElement.value = result.endPoint || "";
    validate(inputElement.value);
  });

  actionBtn.onclick = async () => {
    chrome.storage.sync.set({ endPoint: inputElement.value }, () => {});
    startScraping(inputElement.value);
  };
};


// Initialize The Custom Alert
(() => {
  var ALERT_TITLE = "Oops!"
  var ALERT_BUTTON_TEXT = "Ok"

  if (document.getElementById) {
    window.alert = function (txt) {
      createCustomAlert(txt)
    }
  }

  function createCustomAlert(txt) {
    const d = document

    if (d.getElementById("modalContainer")) return

    const mObj = d
      .getElementsByTagName("body")[0]
      .appendChild(d.createElement("div"))
    mObj.id = "modalContainer"
    mObj.style.height = d.documentElement.scrollHeight + "px"

    const alertObj = mObj.appendChild(d.createElement("div"))
    alertObj.id = "alertBox"
    if (d.all && !window.opera)
      alertObj.style.top = document.documentElement.scrollTop + "px"
    alertObj.style.left =
      (d.documentElement.scrollWidth - alertObj.offsetWidth) / 2 + "px"
    alertObj.style.visiblity = "visible"

    const h1 = alertObj.appendChild(d.createElement("h1"))
    h1.appendChild(d.createTextNode(ALERT_TITLE))

    const msg = alertObj.appendChild(d.createElement("p"))
    msg.innerHTML = txt

    const btn = alertObj.appendChild(d.createElement("a"))
    btn.id = "closeBtn"
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT))
    btn.href = "#"
    btn.focus()
    btn.onclick = () => {
      removeCustomAlert()
      return false
    };

    alertObj.style.display = "block"
  }

  const removeCustomAlert = () => {
    document
      .getElementsByTagName("body")[0]
      .removeChild(document.getElementById("modalContainer"))
  }
})()
