import AuditLog from "../db/schemas/logs-schema.js";

export const getLogs = async (req, res) => {
  const { userId, userRole } = req.user;

  const limit = 20;
  const page = parseInt(req.query.page) || 0;
  const skip = limit * page;

  const filters = {};

  const { startDate, endDate } = req.query;
  function toLocalDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  if (startDate && startDate.trim().length > 0) {
    const start = toLocalDate(startDate);
    if (!endDate || endDate.trim().length === 0) {
      filters.createdAt = { $gte: start };
    } else {
      const end = toLocalDate(endDate);
      end.setDate(end.getDate() + 1);
      filters.createdAt = { $gte: start, $lt: end };
    }
  }

  for (const field in req.query) {
    if (field === "updatedBy") {
      if (req.query[field].trim().length > 0) {
        filters.updatedBy = req.query[field];
      }
    } else if (field === "model") {
      if (req.query[field].trim().length > 0) {
        filters.model = req.query[field];
      }
    } else if (field === "operation") {
      if (req.query[field].trim().length > 0) {
        filters.operation = req.query[field];
      }
    }
  }
  try {
    const [logs, total] = await Promise.all([
      AuditLog.find(filters)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate("updatedBy", "fullName"),
      AuditLog.countDocuments(filters),
    ]);
    if (logs.length === 0)
      return res.status(404).json({ message: "No activites found!" });
    return res.status(200).json({
      logsData: logs,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (error) {
    console.log("FIND LOGS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
