import { scholarships, programmes, successStories } from "./data.js";

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $all("[data-nav]").forEach(a=>{
    const target = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", target === path);
  });
}

function badgeClass(color){
  if(color === "pink") return "badge pink";
  if(color === "green") return "badge green";
  return "badge purple";
}

function scholarshipCardHTML(s){
  return `
  <article class="big-card" data-type="scholarship">
    <div class="media">
      <div class="img-wrap">
        <img src="${s.image}" alt="${s.title}">
      </div>
      <button class="carousel-btn left" type="button" aria-label="Previous">
        <img src="assets/icons/chevron-left.svg" alt="">
      </button>
      <button class="carousel-btn right" type="button" aria-label="Next">
        <img src="assets/icons/chevron-right.svg" alt="">
      </button>
    </div>
    <div class="content">
      <div class="card-top">
        <div>
          <a class="card-title" href="scholarship-details.html?id=${encodeURIComponent(s.id)}">${s.title}</a>
          <p class="card-desc">${s.description}</p>
        </div>
        <span class="${badgeClass(s.badgeColor)}">${s.tag}</span>
      </div>

      <div class="meta">
        <div><b>Country:</b> <span>${s.country}</span></div>
        <div><b>Study Level:</b> <span>${s.degreeLevel}</span></div>
        <div><b>Funding:</b> <span>${s.funding}</span></div>
        <div><b>Duration:</b> <span>${s.duration}</span></div>
        <div><b>Eligibility:</b> <span>${s.eligibility}</span></div>
        <div><b>Application:</b> <span>${s.applicationStatus}</span></div>
      </div>

      <div class="card-actions">
        <a class="btn btn-primary btn-sm" href="scholarship-details.html?id=${encodeURIComponent(s.id)}">Learn More</a>
      </div>
    </div>
  </article>
  `;
}

function programmeCardHTML(p){
  return `
  <article class="big-card program-card" data-type="programme">
    <div class="media">
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.title}">
      </div>
    </div>
    <div class="content">
      <div class="card-top">
        <div>
          <a class="card-title" href="programme-details.html?id=${encodeURIComponent(p.id)}">${p.title}</a>
          <p class="card-desc">${p.description}</p>
        </div>
        <span class="${badgeClass(p.badgeColor)}">${p.tag}</span>
      </div>
      <div class="card-actions">
        <a class="btn btn-primary btn-sm" href="programme-details.html?id=${encodeURIComponent(p.id)}">Learn More</a>
      </div>
    </div>
  </article>
  `;
}

function renderList({items, container, renderer, limit}){
  container.innerHTML = items.slice(0, limit).map(renderer).join("");
}

function uniqueValues(arr, key){
  return Array.from(new Set(arr.map(x => x[key]).filter(Boolean)));
}

function initFiltersForScholarships(){
  const panel = $("#filterPanel");
  const trigger = $("#filterTrigger");
  if(!panel || !trigger) return;

  trigger.addEventListener("click", ()=>{
    panel.classList.toggle("open");
  });

  const country = $("#filterCountry");
  const level = $("#filterLevel");
  const funding = $("#filterFunding");
  const reset = $("#filterReset");

  if(country){
    const vals = uniqueValues(scholarships, "country");
    country.innerHTML = `<option value="">All</option>` + vals.map(v=>`<option value="${v}">${v}</option>`).join("");
  }
  if(level){
    const vals = uniqueValues(scholarships, "degreeLevel");
    level.innerHTML = `<option value="">All</option>` + vals.map(v=>`<option value="${v}">${v}</option>`).join("");
  }
  if(funding){
    const vals = uniqueValues(scholarships, "funding");
    funding.innerHTML = `<option value="">All</option>` + vals.map(v=>`<option value="${v}">${v}</option>`).join("");
  }

  reset?.addEventListener("click", ()=>{
    if(country) country.value = "";
    if(level) level.value = "";
    if(funding) funding.value = "";
    $("#searchInput").value = "";
    applyScholarshipFilters();
  });

  [country, level, funding].forEach(el => el?.addEventListener("change", applyScholarshipFilters));
}

let scholarshipLimit = 3;
function applyScholarshipFilters(){
  const q = ($("#searchInput")?.value || "").trim().toLowerCase();
  const country = $("#filterCountry")?.value || "";
  const level = $("#filterLevel")?.value || "";
  const funding = $("#filterFunding")?.value || "";

  let filtered = scholarships.filter(s => s.title.toLowerCase().includes(q));
  if(country) filtered = filtered.filter(s => s.country === country);
  if(level) filtered = filtered.filter(s => s.degreeLevel === level);
  if(funding) filtered = filtered.filter(s => s.funding === funding);

  const list = $("#scholarshipList");
  if(list){
    renderList({items: filtered, container: list, renderer: scholarshipCardHTML, limit: scholarshipLimit});
  }

  const btn = $("#viewMoreBtn");
  if(btn){
    btn.style.display = filtered.length > scholarshipLimit ? "inline" : "none";
  }
}

function initScholarshipsPage(){
  const list = $("#scholarshipList");
  if(!list) return;

  scholarshipLimit = 3;

  $("#searchInput")?.addEventListener("input", ()=>{
    scholarshipLimit = 3;
    applyScholarshipFilters();
  });

  $("#viewMoreBtn")?.addEventListener("click", ()=>{
    scholarshipLimit = Math.min(scholarshipLimit + 3, scholarships.length);
    applyScholarshipFilters();
  });

  initFiltersForScholarships();
  applyScholarshipFilters();
}

let programmeLimit = 3;
function applyProgrammeFilters(){
  const q = ($("#searchInput")?.value || "").trim().toLowerCase();
  let filtered = programmes.filter(p => p.title.toLowerCase().includes(q));

  const list = $("#programmeList");
  if(list){
    renderList({items: filtered, container: list, renderer: programmeCardHTML, limit: programmeLimit});
  }
  const btn = $("#viewMoreBtn");
  if(btn){
    btn.style.display = filtered.length > programmeLimit ? "inline" : "none";
  }
}

function initProgrammesPage(){
  const list = $("#programmeList");
  if(!list) return;

  programmeLimit = 3;

  $("#searchInput")?.addEventListener("input", ()=>{
    programmeLimit = 3;
    applyProgrammeFilters();
  });

  $("#filterTrigger")?.addEventListener("click", ()=>{
    // placeholder - no filters here in screenshots besides the icon
    alert("Filter panel placeholder (you can add filters later).");
  });

  $("#viewMoreBtn")?.addEventListener("click", ()=>{
    programmeLimit = Math.min(programmeLimit + 3, programmes.length);
    applyProgrammeFilters();
  });

  applyProgrammeFilters();
}

function initScholarshipDetails(){
  const root = $("#scholarshipDetails");
  if(!root) return;

  const id = Number(new URLSearchParams(location.search).get("id") || "1");
  const s = scholarships.find(x => x.id === id) || scholarships[0];

  $("#detailHeroImg").src = s.image;
  $("#detailHeroImg").alt = s.title;
  $("#detailTitle").textContent = `${s.title}: A Complete Guide`;

  // Simple content injection (you can replace with real text later)
  $("#detailIntro").textContent = s.description;
  $("#detailCountry").textContent = s.country;
  $("#detailLevel").textContent = s.degreeLevel;
  $("#detailDuration").textContent = s.duration;
  $("#detailFunding").textContent = s.funding;
  $("#detailEligibility").textContent = s.eligibility;
  $("#detailApplication").textContent = s.applicationStatus;
  $("#detailDeadline").textContent = s.deadline;
}

function initProgrammeDetails(){
  const root = $("#programmeDetails");
  if(!root) return;

  const id = Number(new URLSearchParams(location.search).get("id") || "102");
  const p = programmes.find(x => x.id === id) || programmes[0];

  $("#detailHeroImg").src = p.image;
  $("#detailHeroImg").alt = p.title;
  $("#detailTitle").textContent = `${p.title}: A Complete Guide`;
  $("#detailIntro").textContent = p.description;
}

function initHome(){
  const top = $("#topScholarships");
  if(top){
    top.innerHTML = scholarships.slice(0,3).map(scholarshipCardHTML).join("");
  }
  const prog = $("#topProgrammes");
  if(prog){
    prog.innerHTML = programmes.slice(0,3).map(p=>{
      return `
      <div class="feature-card" style="text-align:left;">
        <div style="display:flex; gap:14px; align-items:center;">
          <div style="width:90px; height:56px; border-radius:14px; overflow:hidden; border:1px solid var(--border); box-shadow: var(--shadow-soft);">
            <img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px;">${p.title}</div>
            <div style="font-size:11px; color: var(--muted); line-height:1.4; margin-top:4px;">${p.description}</div>
          </div>
          <span class="${badgeClass(p.badgeColor)}" style="height:24px;">${p.tag}</span>
        </div>
        <div style="margin-top:10px;">
          <a class="btn btn-primary btn-sm" href="programme-details.html?id=${p.id}">Learn More</a>
        </div>
      </div>
      `;
    }).join("");
  }

  const stories = $("#stories");
  if(stories){
    stories.innerHTML = successStories.map(st=>`
      <div class="feature-card" style="padding:0; overflow:hidden;">
        <div style="background:#9ddcff; height:210px; display:flex; align-items:flex-end; justify-content:center;">
          <img src="${st.image}" alt="${st.name}" style="width: 150px; height: 180px; object-fit:cover; border-radius: 16px; margin-bottom: 14px; box-shadow: var(--shadow-soft);">
        </div>
        <div style="padding:12px 12px 14px; text-align:left;">
          <div style="font-weight:700; font-size:12px;">${st.name}</div>
          <div style="color:#1ea7ff; font-size:11px; margin-top:4px;">${st.quote}</div>
        </div>
      </div>
    `).join("");
  }
}

setActiveNav();
initHome();
initScholarshipsPage();
initProgrammesPage();
initScholarshipDetails();
initProgrammeDetails();
