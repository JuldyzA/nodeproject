  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("click", () => {
        const url = card.getAttribute("data-href");
        if (url) window.location.href = url;
      });
    });
  });