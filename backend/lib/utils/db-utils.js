import mongoose, { model } from "mongoose";
import AuditLog from "../../db/schemas/logs-schema.js";

export const applySaveLogger = (schema, trackedFields = []) => {
  schema.pre("save", async function (next, options) {
    const isNew = this.isNew;
    if (isNew) {
      next();
      return;
    }
    try {
      const original = await this.constructor.findOne({ _id: this._id }).lean();
      if (!original) return;
      this._updaterId = options.updaterId;
      this._original = {};
      trackedFields.forEach((field) => {
        if (this.isModified(field)) {
          this._original[field] = original[field];
        }
      });
      next();
    } catch (error) {
      console.log("PRE SAVE ERROR: ", error);
      next(error);
    }
  });

  schema.post("save", async function (doc) {
    if (!this._original || Object.keys(this._original).length === 0) return;
    const changes = Object.keys(this._original).map((field) => ({
      field,
      oldValue: this._original[field],
      newValue: doc[field],
    }));

    try {
      await AuditLog.insertOne({
        model: this.constructor.modelName,
        documentId: this._id,
        operation: "update",
        updatedBy: this._updaterId,
        changes,
      });
    } catch (error) {
      console.log("POST SAVE ERROR: ", error);
    }
  });
};

export const applyUpdateLogger = (schema, trackedFields = []) => {
  schema.pre("updateMany", async function (next) {
    const filters = this.getFilter();
    const updates = this.getUpdate();

    if (!trackedFields.some((field) => Object.keys(updates).includes(field))) {
      next();
      return;
    }
    try {
      this._updaterId = this.options.context.updaterId;
      const originals = await this.model.find(filters).lean();
      if (!originals) return;
      this._originals = originals;
      this._filters = filters;
      next();
    } catch (error) {
      console.log("UPDATE MANY PRE ERROR: ");
      next(error);
    }
  });

  schema.post("updateMany", async function () {
    const original = this._originals;

    if (!original || original.length === 0) return;

    try {
      const updatedDocs = await this.model.find(this._filters);
      const logs = [];

      original.forEach((doc) => {
        const changedDoc = updatedDocs.find(
          (updated) => doc._id.toString() === updated._id.toString()
        );
        const changes = [];

        trackedFields.forEach((field) => {
          if (
            Array.isArray(changedDoc[field]) &&
            JSON.stringify(changedDoc[field].sort()) !==
              JSON.stringify(doc[field].sort())
          ) {
            changes.push({
              field,
              oldValue: doc[field],
              newValue: changedDoc[field],
            });
          }
          if (
            !Array.isArray(changedDoc[field]) &&
            changedDoc[field] !== doc[field]
          ) {
            changes.push({
              field,
              oldValue: doc[field],
              newValue: changedDoc[field],
            });
          }
        });
        if (changes.length > 0) {
          logs.push({
            model: this.model.modelName,
            documentId: doc._id,
            operation: "update",
            updatedBy: this._updaterId,
            changes,
          });
        }
      });

      await AuditLog.insertMany(logs);
    } catch (error) {
      console.log("POST UPDATE MANY ERROR: ", error);
    }
  });
};

export const applyFindAndUpdateLogger = (schema, trackedFields = []) => {
  schema.pre("findOneAndUpdate", async function (next) {
    const filters = this.getFilter();
    const updates = this.getUpdate();

    if (!trackedFields.some((field) => Object.keys(updates).includes(field))) {
      next();
      return;
    }
    try {
      const original = await this.model.findOne(filters).lean();

      if (!original) {
        return;
      }
      this._original = original;

      this._updaterId = this.options.context.updaterId;
      next();
    } catch (error) {
      console.log("FIND AND UPDATE PRE ERROR: ", error);
      next(error);
    }
  });

  schema.post("findOneAndUpdate", async function (doc) {
    if (!doc || !this._original) {
      return;
    }

    const changes = [];

    trackedFields.forEach((field) => {
      if (
        Array.isArray(doc[field]) &&
        JSON.stringify(doc[field].sort()) !==
          JSON.stringify(this._original[field].sort())
      ) {
        changes.push({
          field,
          oldValue: this._original[field],
          newValue: doc[field],
        });
      }
      if (!Array.isArray(doc[field]) && doc[field] !== this._original[field]) {
        changes.push({
          field,
          oldValue: this._original[field],
          newValue: doc[field],
        });
      }
    });

    if (changes.length > 0) {
      try {
        await AuditLog.insertOne({
          model: this.model.modelName,
          documentId: doc._id,
          operation: "update",
          updatedBy: this._updaterId,
          changes,
        });
      } catch (error) {
        console.log("FIND AND UPDATE POST ERROR: ", error);
      }
    }
  });
};

export const applyFindOneAndDeleteLogger = (schema) => {
  schema.pre("findOneAndDelete", async function (next) {
    const filter = this.getFilter();
    try {
      const original = await this.model.findOne(filter).lean();
      if (!original) return next();
      this._original = original;
      this._deleterId = this.options.context.deleterId;
      next();
    } catch (error) {
      console.log("FIND AND DELETE PRE ERROR: ", error);
      next(error);
    }
  });

  schema.post("findOneAndDelete", async function () {
    if (!this._original) return;

    try {
      await AuditLog.insertOne({
        model: this.model.modelName,
        documentId: this._original._id,
        operation: "delete",
        updatedBy: this._deleterId,
        changes: [
          {
            field: this._original._id,
            oldValue: this._original,
            newValue: "deleted",
          },
        ],
      });
    } catch (error) {
      console.log("FIND AND DELETE POST ERROR: ", error);
    }
  });
};

export const applyDeleteManyLogger = (schema) => {
  schema.pre("deleteMany", async function (next) {
    const filters = this.getFilter();
    try {
      const originals = await this.model.find(filters).lean();
      if (!originals) {
        next();
        return;
      }
      this._originals = originals;
      this._deleterId = this.options.context.deleterId;
      next();
    } catch (error) {
      console.log("DELETE MANY PRE ERROR: ", error);
      next(error);
    }
  });

  schema.post("deleteMany", async function () {
    if (!this._originals) return;
    const logs = this._originals.map((doc) => ({
      model: this.model.modelName,
      documentId: doc._id,
      operation: "delete",
      updatedBy: this._deleterId,
      changes: [{ field: doc._id, oldValue: doc, newValue: "deleted" }],
    }));
    try {
      await AuditLog.insertMany(logs);
    } catch (error) {
      console.log("DELETE MANY POST ERROR: ", error);
    }
  });
};
