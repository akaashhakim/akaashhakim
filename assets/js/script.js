'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // Move ALL your code here

  const elementToggleFunc = function (elem) { elem.classList.toggle("active"); };

  // SIDEBAR
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  sidebarBtn?.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });

  // TESTIMONIAL MODAL
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  });

  modalCloseBtn?.addEventListener("click", testimonialsModalFunc);
  overlay?.addEventListener("click", testimonialsModalFunc);

  // CUSTOM SELECT & FILTERING
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    filterItems.forEach(item => {
      const categories = item.dataset.category.split(',').map(cat => cat.trim().toLowerCase());
      if (selectedValue === "all" || categories.includes(selectedValue)) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  select?.addEventListener("click", function () {
    elementToggleFunc(this);
  });

  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });

  // CONTACT FORM
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // NAVIGATION
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navigationLinks.forEach(link => {
    link.addEventListener("click", function () {
      const targetPage = this.dataset.navLink;

      pages.forEach((page, index) => {
        const match = page.dataset.page === targetPage;
        page.classList.toggle("active", match);
        navigationLinks[index].classList.toggle("active", match);
      });

      window.scrollTo(0, 0);
    });
  });

  // SKILL DROPDOWNS
  const skillCategories = document.querySelectorAll('[data-skill-category]');
  if (skillCategories.length > 0) {
    skillCategories[0].classList.add('active');
  }
  skillCategories.forEach(category => {
    category.addEventListener('click', function () {
      this.classList.toggle('active');
      if (this.classList.contains('active')) {
        skillCategories.forEach(other => {
          if (other !== this && other.classList.contains('active')) {
            other.classList.remove('active');
          }
        });
      }
    });
  });
});
