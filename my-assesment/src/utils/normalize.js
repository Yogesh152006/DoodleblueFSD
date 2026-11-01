export const unwrapList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

export const normalizeStudent = (s) => ({
  ...s,
  id: s.id ?? s._id,
  fullName: s.fullName ?? s.full_name ?? s.name ?? "",
  email: s.email ?? "",
  department: s.department ?? "",
  year: s.year ?? s.year_of_study ?? "",
  cgpa: Number(s.cgpa ?? 0),
});

export const normalizeTeacher = (t) => ({
  ...t,
  id: t.id ?? t._id,
  name: t.name ?? t.teacher_name ?? "",
  email: t.email ?? "",
  department: t.department ?? "",
  subject: t.subject ?? t.subject_name ?? "",
});