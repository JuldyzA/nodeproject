document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  
  // Setup close button listener
  const closeBtn = document.getElementById('close-details');
  const backdrop = document.getElementById('details-backdrop');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeProjectDetails();
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeProjectDetails();
    });
  }
});

// Load all active projects
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

      const coverImage = project.images?.find(img => img.type === 'cover') || project.images?.[0];
      const coverMarkup = coverImage
        ? `<img src="${coverImage.path}" alt="${coverImage.alt}" class="project-image">`
        : '';

      card.innerHTML = `
        <h3>${project.title}</h3>
        ${coverMarkup}
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

// Load project details by ID
async function loadProjectDetails(projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch project details');
    }

    const project = await response.json();
    const detailsSection = document.getElementById('projectDetails');
    const detailsContent = document.getElementById('details-content');

    const images = project.images || [];
    const imageOne = images[0];
    const imageTwo = images[1];
    const imageOneMarkup = imageOne
      ? `
        <figure class="project-figure">
          <img src="${imageOne.path}" alt="${imageOne.alt}" class="project-image">
          <figcaption class="project-figcaption">${imageOne.alt}</figcaption>
        </figure>
      `
      : '';
    const imageTwoMarkup = imageTwo
      ? `
        <figure class="project-figure">
          <img src="${imageTwo.path}" alt="${imageTwo.alt}" class="project-image">
          <figcaption class="project-figcaption">${imageTwo.alt}</figcaption>
        </figure>
      `
      : '';
    const tagsMarkup = (project.tags || [])
      .map(tag => `<span class="tag">${tag}</span>`)
      .join('');

    detailsContent.innerHTML = `
      <h2 id="project-title">${project.title}</h2>
      <p><strong>Tagline:</strong> ${project.tagline}</p>
      ${(imageOneMarkup || imageTwoMarkup) ? `<div class="project-gallery">${imageOneMarkup}${imageTwoMarkup}</div>` : ''}
      <p><strong>Description:</strong> ${project.description}</p>
      <p><strong>Stack:</strong> ${project.stack.join(', ')}</p>
      ${tagsMarkup ? `<div class="tags">${tagsMarkup}</div>` : ''}
      <p><strong>Created:</strong> ${project.dates.created}</p>
      <p><strong>Last Updated:</strong> ${project.dates.updated}</p>
    `;

    // Hide projects grid and show details
    document.getElementById('projectsGrid').style.display = 'none';
    detailsSection.classList.add('is-open');
    detailsSection.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

  } catch (error) {
    console.error(error);
    const detailsContent = document.getElementById('details-content');
    if (detailsContent) {
      detailsContent.innerHTML = `
        <p class="error-message">Error loading project details. Please try again later.</p>
      `;
    }
    const detailsSection = document.getElementById('projectDetails');
    if (detailsSection) {
      detailsSection.classList.add('is-open');
      detailsSection.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
  }
}

function closeProjectDetails() {
  const detailsSection = document.getElementById('projectDetails');
  if (!detailsSection) {
    return;
  }
  detailsSection.classList.remove('is-open');
  detailsSection.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  document.getElementById('projectsGrid').style.display = 'grid';
}