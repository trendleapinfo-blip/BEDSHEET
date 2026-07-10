const resp = await fetch("http://localhost:3000/api/admin/seed", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-seed-secret": "closerush_seed_bootstrap_2026"
  }
});
const data = await resp.json();
console.log(JSON.stringify(data, null, 2));
