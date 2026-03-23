
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateContactForm(data) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.name) {
    errors.push("Name is required.");
  }

  if (!data.email) {
    errors.push("Email is required.");
  } else if (!emailRegex.test(data.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!data.message) {
    errors.push("Message is required.");
  } else if (data.message.length < 10) {
    errors.push("Message must be at least 10 characters.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
const form = document.getElementById("contact_form");
const responseArea = document.getElementById("form_response");

if (form && responseArea) {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = form.elements["name"];
    const emailInput = form.elements["email"];
    const messageInput = form.elements["message"];

    const data = {
      name: nameInput ? nameInput.value.trim() : "",
      email: emailInput ? emailInput.value.trim() : "",
      message: messageInput ? messageInput.value.trim() : ""
    };

    const validation = validateContactForm(data);
    if (!validation.isValid) {
      responseArea.innerHTML = `
        <div class="warning-message">
          ${validation.errors.map((error) => `<div>${escapeHtml(error)}</div>`).join("")}
        </div>
      `;
      return;
    }

    try {

      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      responseArea.innerHTML =
        `<div class="${res.ok ? "success-message" : "warning-message"}">
          ${result.message || (res.ok ? "Message sent successfully." : "Please check your input and try again.")}
        </div>`;

      if (res.ok) form.reset();

    } catch (err) {

      console.error(err);
      responseArea.innerHTML =
        `<div class="warning-message">Network error. Try again.</div>`;

    }

  });

}