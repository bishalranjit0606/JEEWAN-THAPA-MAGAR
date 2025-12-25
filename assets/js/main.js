/* ================ SHOW MENU =============== */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* ========= MENU SHOW ========= */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* ========= MENU HIDDEN ======== */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/* ============== REMOVE MENU MOBILE CLICK LIST ============ */
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
};
navLink.forEach((list) => list.addEventListener("click", linkAction));

/* =============== CHANGE BACKGROUND HEADER ============= */
const scrollHeader = () => {
  const header = document.getElementById("header");
  this.scrollY >= 50
    ? header.classList.add("bg-header")
    : header.classList.remove("bg-header");
};
window.addEventListener("scroll", scrollHeader);

/* =============== THEME TOGGLE ============= */
const themeToggle = document.getElementById("theme-toggle"),
  themeIcon = document.getElementById("theme-icon");

// Get theme from localStorage or default to light mode
const getCurrentTheme = () => localStorage.getItem("theme") || "light";
const getCurrentIcon = () =>
  localStorage.getItem("theme") === "dark" ? "ri-sun-line" : "ri-moon-line";

// Set initial theme (default to light mode)
const selectedTheme = getCurrentTheme();
const selectedIcon = getCurrentIcon();

document.body.setAttribute("data-theme", selectedTheme);
themeIcon.className = selectedIcon;

// Toggle theme on button click
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    const newIcon = newTheme === "dark" ? "ri-sun-line" : "ri-moon-line";

    document.body.setAttribute("data-theme", newTheme);
    themeIcon.className = newIcon;

    localStorage.setItem("theme", newTheme);
  });
}

/* ============== CALCULATE BMI JS ================== */
const calculateForm = document.getElementById("calculate-form"),
  calculateCm = document.getElementById("calculate-cm"),
  calculateKg = document.getElementById("calculate-kg"),
  calculateMessage = document.getElementById("calculate-message");

const calculateBmi = (e) => {
  e.preventDefault();

  // Check if the fields have a value
  if (calculateCm.value == "" || calculateKg.value == "") {
    // Add and remove color
    calculateMessage.classList.remove("color-green");
    calculateMessage.classList.add("color-red");

    // Show message
    calculateMessage.textContent = "Fill in the Height and Weight";

    // Remove message three seconds
    setTimeout(() => {
      calculateMessage.textContent = "";
    }, 3000);
  } else {
    // BMI Formul
    const cm = calculateCm.value / 100,
      kg = calculateKg.value,
      bmi = Math.round(kg / (cm * cm));

    // Show your health status
    if (bmi < 18.5) {
      // Add color and display message
      calculateMessage.classList.add("color-green");
      calculateMessage.textContent = `Your BMI is ${bmi} and you are Skinny`;
    } else if (bmi < 25) {
      calculateMessage.classList.add("color-green");
      calculateMessage.textContent = `Your BMI is ${bmi} and you are Healthy`;
    } else {
      calculateMessage.classList.add("color-green");
      calculateMessage.textContent = `Your BMI is ${bmi} and you are Overweight`;
    }

    // To clear the input field
    calculateKg.value = "";
    calculateCm.value = "";

    // Remove message four seconds
    setTimeout(() => {
      calculateMessage.textContent = "";
    }, 5000);
  }
};
calculateForm.addEventListener("submit", calculateBmi);

/* =============== EMAIL JS =============== */
const contactForm = document.getElementById("contact-form"),
  contactMessage = document.getElementById("contact-message"),
  contactUser = document.getElementById("contact-user");

const sendEmail = (e) => {
  e.preventDefault();

  // Check if the field has a value
  if (contactUser.value === "") {
    //Add and remove color
    contactMessage.classList.remove("color-green");
    contactMessage.classList.add("color-red");

    //Show Message
    contactMessage.textContent = "You must enter your mail";

    // Remove message three seconds
    setTimeout(() => {
      contactMessage.textContent = "";
    }, 2000);
  } else {
    // emailjs form settings Key
    emailjs
      .sendForm("serviceID", "templateID", "#Form", "publicKey")
      .then(() => {
        // Show message and add color
        contactMessage.classList.add("color-green");
        contactMessage.textContent = "You registered successfully";

        //Remove message after three seconds
        setTimeout(() => {
          contactMessage.textContent = "";
        }, 3000);
      });
    // To clear the input user
    contactUser.value = "";
  }
};
contactForm.addEventListener("submit", sendEmail);

/* =============== SHOW SCROLL UP ============== */
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is hiher than 350 viewport
  this.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/* =============== TRANSFORMATION SLIDER ============== */
const initTransformationSliders = () => {
  const sliders = document.querySelectorAll('.transformation__slider');

  sliders.forEach(slider => {
    const afterImage = slider.querySelector('.transformation__after');
    const divider = slider.querySelector('.transformation__divider');
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      const position = ((x - rect.left) / rect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));

      afterImage.style.clipPath = `polygon(${clampedPosition}% 0, 100% 0, 100% 100%, ${clampedPosition}% 100%)`;
      divider.style.left = `${clampedPosition}%`;
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateSlider(e.clientX);
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    });

    slider.addEventListener('touchmove', (e) => {
      if (isDragging) {
        e.preventDefault();
        updateSlider(e.touches[0].clientX);
      }
    });

    slider.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
};

// Initialize sliders when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTransformationSliders);
} else {
  initTransformationSliders();
}
