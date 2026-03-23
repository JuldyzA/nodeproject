"use strict";

const express = require("express");
const router = express.Router();

const contactRepo = require("../lib/contact.repository");
const categoryRepo = require("../lib/category.repository");
const projectRepo = require("../lib/project.repository");
const userRepo = require("../lib/user.repository");
const logRepo = require("../lib/log.repository");
const upload = require("../middleware/upload");
const multer = require("multer");
const { isAuthenticated, isModeratorOrAdmin, isAdmin } = require("../middleware/authMiddleware");

router.use(isAuthenticated);
router.use(isModeratorOrAdmin);

/* DASHBOARD (MODERATOR + ADMIN) */
router.get("/", async (req, res) => {
  try {
    const projects = await projectRepo.getAllProjects();
    const categories = await categoryRepo.getCategoriesWithCount();
    const contacts = await contactRepo.getAllContacts();
    const usersCount = await userRepo.getUsersCount();
    const securityEvents = req.user && req.user.role === "ADMIN"
      ? await logRepo.getRecentUnauthorizedAccess(8)
      : [];

    const projectCount = projects.length;
    const categoryCount = categories.length;
    const unreadCount = contacts.filter((c) => !c.isRead).length;

    res.render("admin/dashboard", {
      projectCount,
      categoryCount,
      unreadCount,
      usersCount,
      securityEvents,
      error: req.query.error || null
    });
  } catch (err) {
    console.error(err);
    res.render("admin/dashboard", {
      projectCount: 0,
      categoryCount: 0,
      unreadCount: 0,
      usersCount: 0,
      securityEvents: []
    });
  }
});

/* CONTACTS (MODERATOR + ADMIN) */
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await contactRepo.getAllContacts();
    res.render("admin/contacts", {
      contacts,
      warning: req.query.warning || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/contacts/:id/read", async (req, res) => {
  try {
    const contact = await contactRepo.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).send("Message not found");
    }

    await contactRepo.updateContact(req.params.id, { isRead: !contact.isRead });
    res.redirect("/admin/contacts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/contacts/:id/delete", isAdmin, async (req, res) => {
  try {
    await contactRepo.deleteContact(req.params.id);
    res.redirect("/admin/contacts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/contacts/:id/delete-attempt", async (req, res) => {
  try {
    if (req.user && req.user.role !== "ADMIN") {
      await logRepo.logUnauthorizedAccess(req, "ADMIN");
      return res.redirect(
        `/admin/contacts?warning=${encodeURIComponent("Delete blocked: only ADMIN users can delete contact submissions.")}`
      );
    }

    return res.redirect("/admin/contacts");
  } catch (err) {
    console.error(err);
    return res.redirect(
      `/admin/contacts?warning=${encodeURIComponent("Could not log delete attempt. Please try again.")}`
    );
  }
});

/* CATEGORIES (ADMIN ONLY) */
router.get("/categories", isAdmin, async (req, res) => {
  try {
    const categories = await categoryRepo.getCategoriesWithCount();
    res.render("admin/categories", { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/categories/new", isAdmin, (req, res) => {
  res.render("admin/category-form", {
    category: null
  });
});

router.post("/categories", isAdmin, async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    await categoryRepo.createCategory({
      name,
      slug,
      description
    });
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/categories/:id/edit", isAdmin, async (req, res) => {
  try {
    const category = await categoryRepo.getCategoryById(req.params.id);
    res.render("admin/category-form", { category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/categories/:id", isAdmin, async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    await categoryRepo.updateCategory(req.params.id, { name, slug, description });
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/categories/:id/delete", isAdmin, async (req, res) => {
  try {
    await categoryRepo.deleteCategory(req.params.id);
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    res.send("Cannot delete category because it has projects");
  }
});

/* PROJECTS (ADMIN ONLY) */
router.get("/projects", isAdmin, async (req, res) => {
  try {
    const projects = await projectRepo.getAllProjects();
    res.render("admin/projects", { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/projects/new", isAdmin, async (req, res) => {
  try {
    const categories = await categoryRepo.getAllCategories();
    res.render("admin/project-form", { project: null, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/projects", isAdmin, async (req, res) => {
  try {
    await projectRepo.createProject(req.body);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/projects/:id/edit", isAdmin, async (req, res) => {
  try {
    const project = await projectRepo.getProjectById(req.params.id);
    const categories = await categoryRepo.getAllCategories();
    res.render("admin/project-form", { project, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/projects/:id", isAdmin, async (req, res) => {
  try {
    await projectRepo.updateProject(req.params.id, req.body);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/projects/:id/delete", isAdmin, async (req, res) => {
  try {
    await projectRepo.deleteProject(req.params.id);
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* PROJECT IMAGES (ADMIN ONLY) */
router.get("/projects/:projectId/images", isAdmin, async (req, res) => {
  const { projectId } = req.params;
  const project = await projectRepo.getProjectById(projectId);

  if (!project) {
    return res.redirect("/admin/projects");
  }

  res.render("admin/project-image-form", { project });
});

router.post(
  "/projects/:projectId/images",
  isAdmin,
  (req, res, next) => {
    upload.single("projectImage")(req, res, async (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return renderImageFormWithError(
          res,
          req.params.projectId,
          413,
          "File too large. Max size is 5MB."
        );
      }

      if (err) {
        return renderImageFormWithError(
          res,
          req.params.projectId,
          400,
          "Upload failed. Please try again."
        );
      }

      next();
    });
  },
  async (req, res) => {
    const { projectId } = req.params;
    const { altText, caption, isFeatured } = req.body;

    if (!req.file) {
      return renderImageFormWithError(
        res,
        projectId,
        400,
        "No valid image file was uploaded."
      );
    }

    const result = await projectRepo.addProjectImageToProject(projectId, req.file, {
      altText,
      caption,
      isFeatured
    });

    if (!result.success) {
      return renderImageFormWithError(
        res,
        projectId,
        500,
        result.errorMessage || "Could not save image metadata."
      );
    }

    return res.redirect("/admin/projects/" + projectId + "/images");
  }
);

router.patch("/projects/:projectId/images/:imageId", isAdmin, async (req, res) => {
  const { projectId, imageId } = req.params;
  const updates = {
    altText: req.body.altText,
    caption: req.body.caption,
    isFeatured: req.body.isFeatured
  };

  const result = await projectRepo.updateProjectImageMetadata(projectId, imageId, updates);

  if (!result.success) {
    return res.status(400).json({ success: false, errorMessage: result.errorMessage });
  }

  res.json({ success: true, message: "Metadata updated successfully!" });
});

router.delete("/projects/:projectId/images/:imageId", isAdmin, async (req, res) => {
  const { projectId, imageId } = req.params;
  const result = await projectRepo.deleteProjectImage(projectId, imageId);

  res.json({ success: result.success, error: result.errorMessage });
});

/* USERS (ADMIN ONLY) */
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await userRepo.getAllUsers();
    res.render("admin/users", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/users/new", isAdmin, (req, res) => {
  res.render("admin/user-form", {
    user: null,
    roles: ["USER", "MODERATOR", "ADMIN"],
    error: null
  });
});

router.post("/users", isAdmin, async (req, res) => {
  try {
    const { email, nickname, password, confirmPassword, role } = req.body;

    if (!email || !nickname || !password || !confirmPassword || !role) {
      return res.status(400).render("admin/user-form", {
        user: null,
        roles: ["USER", "MODERATOR", "ADMIN"],
        error: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("admin/user-form", {
        user: null,
        roles: ["USER", "MODERATOR", "ADMIN"],
        error: "Passwords do not match"
      });
    }

    await userRepo.createUserByAdmin({
      email,
      nickname,
      plainPassword: password,
      role
    });

    return res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    return res.status(500).render("admin/user-form", {
      user: null,
      roles: ["USER", "MODERATOR", "ADMIN"],
      error: err.message || "Failed to create user"
    });
  }
});

router.get("/users/:id/edit", isAdmin, async (req, res) => {
  try {
    const user = await userRepo.getUserById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("admin/user-form", {
      user,
      roles: ["USER", "MODERATOR", "ADMIN"],
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/users/:id", isAdmin, async (req, res) => {
  try {
    const { email, nickname, role, password, confirmPassword } = req.body;

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        const user = await userRepo.getUserById(req.params.id);
        return res.status(400).render("admin/user-form", {
          user,
          roles: ["USER", "MODERATOR", "ADMIN"],
          error: "Passwords do not match"
        });
      }

      await userRepo.updateUserPassword(req.params.id, password);
    }

    await userRepo.updateUser(req.params.id, { email, nickname, role });
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    const user = await userRepo.getUserById(req.params.id);
    res.status(500).render("admin/user-form", {
      user,
      roles: ["USER", "MODERATOR", "ADMIN"],
      error: err.message || "Failed to update user"
    });
  }
});

router.post("/users/:id/delete", isAdmin, async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).send("You cannot delete your own account.");
    }

    await userRepo.deleteUser(req.params.id);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

async function renderImageFormWithError(res, projectId, statusCode, error) {
  const project = await projectRepo.getProjectById(projectId);
  if (!project) {
    return res.redirect("/admin/projects");
  }

  return res.status(statusCode).render("admin/project-image-form", {
    project,
    error
  });
}

module.exports = router;
