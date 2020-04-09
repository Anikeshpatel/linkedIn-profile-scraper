chrome.runtime.sendMessage({ action: "showPopup" })

chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
	if (request.action === "profile") {
		showLoading();
		const profile = {
			skills: [],
		}

		window.scroll({
			top: document.body.clientHeight,
			left: 0,
			behavior: "smooth",
		})

		setTimeout(() => {
			profile.Name = document
				.querySelector(".pv-top-card--list")
				.getElementsByTagName("li")[0]
				.textContent.trim();
			const skillPanelBtn = document.querySelector(
				".pv-profile-section__card-action-bar.pv-skills-section__additional-skills"
			)

			if (
				skillPanelBtn.getElementsByTagName("span")[0].textContent.trim() ===
				"Show more"
			) {
				skillPanelBtn.click()
			}

			setTimeout(() => {
				let skillsView = document.querySelector("#skill-categories-expanded")
				for (let child of skillsView.children) {
					let category = child.getElementsByTagName("h3")[0].textContent.trim()
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

				document.querySelector("a[data-control-name=contact_see_more]").click()

				setTimeout(() => {
					const profileInfoView = document.querySelector(
						".pv-profile-section__section-info.section-info"
					);
					for (let child of profileInfoView.children) {
						let title = child.getElementsByTagName("header")[0].innerText
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
								profile[title] = section.getElementsByTagName("a")[0].innerText
							} else if (section.getElementsByTagName("a").length > 0) {
								profile[title] = section.getElementsByTagName("a")[0].href
							}
						}
					}

					document.querySelector('button[data-test-modal-close-btn]').click()
					window.scroll({
						top: 0,
						left: 0,
						behavior: "smooth",
					})

					console.log(profile)
					var xmlhttp = new XMLHttpRequest()
					xmlhttp.open("POST", request.endPoint)
					xmlhttp.setRequestHeader("Content-Type", "application/json")
					xmlhttp.send(JSON.stringify(profile))
					sendMessage({profile})
					dismissLoading()
				}, 1000)
			}, 1000)
		}, 3000)
	}
})

const spinnerTemplate = `
	<div class="sk-chase">
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
		<div class="sk-chase-dot"></div>
	</div>
`

const showLoading = () => {
	const backdrop = document.createElement("div")
	backdrop.className = "backdrop"
	backdrop.innerHTML = spinnerTemplate
	document.body.appendChild(backdrop)
	document.body.style.overflow = 'hidden'
	document.querySelector('#extended-nav').style.position = 'relative'
}

const dismissLoading = () => {
	document.querySelector('.backdrop').remove()
	document.body.style.overflow = 'auto'
	document.querySelector('#extended-nav').style.position = 'fixed'
}
