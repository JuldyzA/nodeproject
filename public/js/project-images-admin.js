async function deleteProjectImage(projectId, imageId) {
  if (!confirm("Are you sure you want to permanently delete this image?"))
    return;

  try {
    const response = await fetch(
      `/admin/projects/${projectId}/images/${imageId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (data.success) {
      // 1. Visually remove the card from the UI
      document
        .querySelector(`.image-edit-card[data-image-id="${imageId}"]`)
        .remove();
    } else {
      alert("Failed to delete image metadata.");
    }
  } catch (error) {
    console.error(error);
    alert("An unexpected error occurred.");
  }
}
async function updateImageMetadata(projectId, imageId) {
  try {
    const card = document.querySelector(
      ".image-edit-card[data-image-id=\"" + imageId + "\"]"
    );
    if (!card) return alert("Image card not found.");

    const altText = card.querySelector("input[name=\"altText\"]")?.value || "";
    const caption = card.querySelector("input[name=\"caption\"]")?.value || "";

    const featuredRadio = document.querySelector("input[name=\"isFeatured\"]:checked");
    const isFeatured = featuredRadio ? featuredRadio.value === imageId : false;

    const response = await fetch("/admin/projects/" + projectId + "/images/" + imageId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ altText, caption, isFeatured })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return alert(data.errorMessage || "Failed to update metadata.");
    }

    alert("Metadata updated.");
  } catch (error) {
    console.error(error);
    alert("Unexpected error while updating metadata.");
  }
}