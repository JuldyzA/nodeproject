console.log("contact.js loaded");

const form = document.getElementById("contact_form");
const responseArea = document.getElementById("form_response");

if (!form) {
  console.log("Form not found");
} else {
  console.log("Form detected");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit intercepted");

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value
        })
      });
      //non 200 response, handle server errors
      const data = await response.json();
      if (!response.ok) {
        responseArea.innerHTML = `<div class="error-message">${data.message || 'An error occurred.'}</div>`;
        return;
      }

      responseArea.innerHTML = `<div class="success-message">${data.message}</div>`;

    } catch (error) {
        //network error or other unexpected issues
      console.error("Error submitting form:", error);
      responseArea.innerHTML =
        `<div class="error-message">Network error occurred.</div>`;
    }
  });
}