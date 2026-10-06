// Vercel serverless function: CRUD for students, backed by Supabase (Postgres) via its REST API.
// Required environment variables: SUPABASE_URL, SUPABASE_SERVICE_KEY

const URL_BASE = () => `${process.env.SUPABASE_URL}/rest/v1/students`;
const headers = (extra = {}) => {
  const key = process.env.SUPABASE_SERVICE_KEY;
  const h = { apikey: key, "Content-Type": "application/json", ...extra };
  // Legacy service_role keys are JWTs (start with "eyJ") and go in Authorization too.
  if (key.startsWith("eyJ")) h.Authorization = `Bearer ${key}`;
  return h;
};

function clean(b) {
  const s = {
    id: Number(b.id),
    name: String(b.name || "").trim().slice(0, 100),
    roll: String(b.roll || "").trim().slice(0, 30),
    email: String(b.email || "").trim().slice(0, 120),
    course: String(b.course || "").trim().slice(0, 80),
    age: Number(b.age),
  };
  if (!Number.isFinite(s.id) || s.id <= 0) return { error: "Invalid id." };
  if (!s.name) return { error: "Enter the student's full name." };
  if (!s.roll) return { error: "Enter a roll number." };
  if (!/^\S+@\S+\.\S+$/.test(s.email)) return { error: "Enter a valid email address." };
  if (!s.course) return { error: "Enter the course name." };
  if (!Number.isInteger(s.age) || s.age < 1 || s.age > 100) return { error: "Enter an age between 1 and 100." };
  return { student: s };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(503).json({ error: "Database is not configured." });
  }
  try {
    if (req.method === "GET") {
      const r = await fetch(`${URL_BASE()}?select=*&order=id.desc`, { headers: headers() });
      const data = await r.json();
      return res.status(r.ok ? 200 : 500).json(r.ok ? data : { error: "Could not load students." });
    }

    if (req.method === "POST") {
      const { student, error } = clean(req.body || {});
      if (error) return res.status(400).json({ error });
      const r = await fetch(`${URL_BASE()}?on_conflict=id`, {
        method: "POST",
        headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
        body: JSON.stringify(student),
      });
      const data = await r.json();
      if (r.status === 409) return res.status(409).json({ error: "This roll number already exists." });
      if (!r.ok) return res.status(500).json({ error: "Could not save the student." });
      return res.status(200).json(data[0]);
    }

    if (req.method === "DELETE") {
      const id = Number(req.query.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id." });
      const r = await fetch(`${URL_BASE()}?id=eq.${id}`, { method: "DELETE", headers: headers() });
      if (!r.ok) return res.status(500).json({ error: "Could not delete the student." });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (e) {
    return res.status(500).json({ error: "Server error." });
  }
};
