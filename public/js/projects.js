document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});

// ===============================
// Load all active projects
// ===============================
async function loadProjects() {
  try {
    const response = await fetch('/api/projects');

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();
    const container = document.getElementById('projectsGrid');

    container.innerHTML = '';

    projects.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.tagline}</p>
        <p><strong>Stack:</strong> ${project.stack.join(', ')}</p>
        <button data-id="${project.id}" class="detailsBtn">
          Details
        </button>
      `;

      container.appendChild(card);
    });

    // Add click listeners AFTER rendering
    document.querySelectorAll('.detailsBtn').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        loadProjectDetails(id);
      });
    });

  } catch (error) {
    console.error(error);

    document.getElementById('projectsGrid').innerHTML = `
      <p style="color:red;">
        Error loading projects. Please try again later.
      </p>
    `;
  }
}