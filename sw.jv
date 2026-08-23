/* ==========================================================================
   Loop — app logic
   Everything is deterministic per calendar day (local time), so content
   is stable for the whole day and identical for every visitor on that day.
   Tool completions/PRs are stored per-device in localStorage.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Content banks
     --------------------------------------------------------------------- */

  const FACTS = [
    { t: "Bananas are berries", b: "Botanically, bananas qualify as berries because they grow from a single flower with one ovary. Strawberries, oddly, do not." },
    { t: "Wombat droppings are cube-shaped", b: "A wombat's intestines flex unevenly during digestion, pressing waste into near-perfect cubes so it won't roll away from scent markers." },
    { t: "Flamingos are born grey", b: "Their pink colour comes entirely from pigments in the shrimp and algae they eat, not from their own biology." },
    { t: "Honey never spoils", b: "Archaeologists have found pots of honey in ancient Egyptian tombs that are still perfectly edible after 3,000 years." },
    { t: "Octopuses have three hearts", b: "Two pump blood to the gills, one to the rest of the body — and that main heart actually stops beating when they swim." },
    { t: "A day on Venus is longer than its year", b: "Venus takes 243 Earth days to spin once, but only 225 Earth days to orbit the Sun." },
    { t: "Sharks predate trees", b: "Sharks have been around for roughly 400 million years — trees didn't appear until about 350 million years ago." },
    { t: "Your nose can remember 50,000 scents", b: "The human olfactory system can distinguish and store tens of thousands of distinct smells over a lifetime." },
    { t: "There's a mushroom bigger than a city", b: "A single honey fungus in Oregon spans about 9.6 km² underground, making it one of the largest known organisms." },
    { t: "Hot water can freeze faster than cold", b: "Under specific conditions this is known as the Mpemba effect, and scientists still debate the exact cause." },
    { t: "Butterflies taste with their feet", b: "Chemoreceptors on their legs let them identify whether a leaf is edible the moment they land on it." },
    { t: "Bubble wrap was invented as wallpaper", b: "In 1957, two engineers tried to sell textured plastic sheets as a trendy wall covering before it became packaging." },
    { t: "The Eiffel Tower grows in summer", b: "Heat makes the iron expand, adding up to 15 cm to its height on hot days." },
    { t: "Wood frogs can freeze solid and survive", b: "In winter their hearts stop and up to 65% of their body water turns to ice — then they thaw out and hop away in spring." },
    { t: "Cleopatra lived closer to the Moon landing than the pyramids", b: "The Great Pyramid was already about 2,500 years old when Cleopatra was born." },
    { t: "A group of flamingos is a 'flamboyance'", b: "Collective animal names get weirder the more you look: crows gather in a 'murder', owls in a 'parliament'." },
    { t: "Sea otters hold hands while sleeping", b: "They link paws in groups called 'rafts' so the current doesn't drift them apart during the night." },
    { t: "The shortest war in history lasted 38 minutes", b: "The Anglo-Zanzibar War of 1896 ended in well under an hour after the Sultan's palace surrendered." },
    { t: "Some cats are actually allergic to humans", b: "It's rare, but cats can develop skin reactions to proteins in human skin cells and dander." },
    { t: "Bananas are naturally slightly radioactive", b: "They contain potassium-40, enough that scientists use the 'banana equivalent dose' as a casual radiation reference unit." },
    { t: "There are more possible chess games than atoms in the universe", b: "The number of unique legal chess games vastly exceeds the estimated 10^80 atoms observable in the universe." },
    { t: "Antarctica is technically a desert", b: "It receives so little precipitation that, by definition, it's the largest desert on Earth — just a frozen one." },
    { t: "Koalas have fingerprints almost identical to humans", b: "They're so close that they've occasionally confused forensic investigators at crime scenes." },
    { t: "The inventor of the Pringles can is buried in one", b: "Fredric Baur asked for part of his ashes to be interred inside the container he designed." },
    { t: "Space smells like seared steak", b: "Astronauts describe the scent that clings to their suits after a spacewalk as metallic, smoky, and faintly like grilled meat." },
    { t: "A bolt of lightning is hotter than the Sun's surface", b: "Lightning can reach roughly 30,000°C — about five times hotter than the Sun's surface temperature." },
    { t: "The world's oldest known recipe is for beer", b: "A 4,000-year-old Sumerian hymn to the goddess Ninkasi doubles as brewing instructions." },
    { t: "Elephants can't jump", b: "Every other land mammal can get all four feet off the ground at once — elephants are the only exception." },
    { t: "Venus is the hottest planet, not Mercury", b: "Despite being farther from the Sun, Venus's thick atmosphere traps heat, making it hotter than Mercury." },
    { t: "Your stomach gets an entirely new lining every few days", b: "Stomach acid is strong enough to dissolve zinc, so the lining regenerates roughly every 3-4 days to protect itself." },
    { t: "The Great Wall of China isn't visible from space with the naked eye", b: "It's long, but too narrow to be seen without aid from low Earth orbit — a persistent myth says otherwise." },
    { t: "Slugs have four noses", b: "Technically four tentacles that sense smell, light, and touch — two are retractable eye stalks, two are for scent." },
    { t: "The dot on top of a lowercase 'i' has a name", b: "It's called a tittle, from the Latin 'titulus'." },
    { t: "Tigers have striped skin, not just striped fur", b: "If you shaved a tiger, the pattern would still be visible on its skin underneath." },
    { t: "A cloud can weigh over a million kilograms", b: "An average cumulus cloud contains around 500 tonnes of water — some storm clouds weigh far more." },
    { t: "Humans share about 60% of their DNA with bananas", b: "Many basic genes for cell function are so ancient they're shared across wildly different life forms." },
    { t: "The inventor of the frisbee became a frisbee after he died", b: "Walter Morrison's ashes were molded into limited-edition commemorative discs, per his family's request." },
    { t: "Sloths can hold their breath longer than dolphins", b: "By slowing their heart rate, sloths can stay underwater for up to 40 minutes." },
    { t: "There's a species of jellyfish that is biologically immortal", b: "Turritopsis dohrnii can revert its cells to an earlier life stage instead of dying of old age." },
    { t: "The shortest commercial flight in the world lasts under 2 minutes", b: "A route between two Scottish islands, Westray and Papa Westray, can take as little as 47 seconds." },
    { t: "Cows have best friends", b: "Studies show cows form close bonds with specific herd members and get stressed when separated from them." },
    { t: "The Mona Lisa has no eyebrows", b: "It was fashionable in Renaissance Florence to pluck them, or they simply faded over the centuries of restoration." },
    { t: "A single strand of spaghetti is called a 'spaghetto'", b: "In Italian, '-i' is the plural ending, so technically you eat many spaghetti, one spaghetto." },
    { t: "Peanuts aren't nuts", b: "They're legumes, growing underground in pods, more closely related to beans and lentils than to almonds." },
    { t: "The unicorn is Scotland's national animal", b: "Chosen for its associations with purity and dominance, it has represented Scotland since the 1300s." },
    { t: "You can't hum while holding your nose closed", b: "Humming requires airflow through the nasal passage, so pinching it shut silences the sound entirely." },
    { t: "Onions can make you cry from across the room", b: "Their sulfur compounds turn into a gas that irritates eyes even before you start cutting, if the air is still." },
    { t: "The first oranges weren't orange", b: "The original citrus from Southeast Asia was closer to green; selective breeding over centuries produced today's colour." },
    { t: "A crocodile can't stick its tongue out", b: "A membrane holds it firmly in place at the roof of its mouth." }
  ];

  const QUOTES = [
    "Small steps, repeated daily, outrun big plans that never start.",
    "Discipline is choosing between what you want now and what you want most.",
    "You don't need more time, you need fewer distractions.",
    "The obstacle you're avoiding is usually the one worth facing first.",
    "Consistency turns ordinary effort into extraordinary results.",
    "Comfort is a slow trade for regret.",
    "Every expert was once a beginner who refused to quit.",
    "Progress hides inside boring repetition.",
    "Do it badly today so you can do it well tomorrow.",
    "Momentum is built, not found.",
    "The best time was yesterday. The next best time is now.",
    "Focus is saying no to a hundred good ideas for one great one.",
    "Growth lives right outside your comfort zone, not far past it.",
    "A calm mind gets more done than a busy one.",
    "You only live once, but if you do it right, once is enough.",
    "Patience is a plan working quietly in the background.",
    "Habits are the compound interest of self-improvement.",
    "Start before you feel ready. Ready rarely comes first.",
    "Rest is part of the work, not a break from it.",
    "What you repeat, you become.",
    "The hardest part is rarely the task, it's the starting.",
    "Small wins stack into big change.",
    "Clarity comes from action, not thought alone.",
    "You can't pour from an empty cup, so fill your own first.",
    "Done is better than perfect, most days.",
    "Nobody drowns from falling in water, only from staying there.",
    "Slow progress is still progress.",
    "Your future is built in the version of today you're living now.",
    "Discomfort today buys ease tomorrow.",
    "Ideas are cheap. Execution is everything.",
    "The quality of your attention shapes the quality of your day.",
    "Don't wait for motivation, build a routine instead.",
    "Every skill was once impossible until it was practiced.",
    "Simplicity is the last step before mastery.",
    "You are one decision away from a completely different life.",
    "Energy flows where focus goes.",
    "Do the work; confidence follows, not the other way around.",
    "A goal without a deadline is just a wish.",
    "Speed matters less than direction.",
    "The days are long, but the years are short — use them.",
    "Nothing changes if nothing changes.",
    "Build the habit before you need the result.",
    "You won't always feel like it. Do it anyway.",
    "Small disciplines repeated daily lead to great achievements.",
    "Trust the process, question the excuses.",
    "There is no finish line, only better versions of today.",
    "Effort compounds quietly until it doesn't.",
    "Choose hard now, or choose harder later.",
    "The best view comes after the hardest climb.",
    "One percent better today is enough."
  ];

  const WORDS = [
    { w: "Ephemeral", ipa: "/ɪˈfem(ə)rəl/", nl: "vluchtig, kortstondig", ex: "Fame on the internet can be ephemeral — gone within a week." },
    { w: "Ubiquitous", ipa: "/juːˈbɪkwɪtəs/", nl: "alomtegenwoordig", ex: "Smartphones have become ubiquitous in modern life." },
    { w: "Meticulous", ipa: "/məˈtɪkjələs/", nl: "uiterst nauwkeurig", ex: "She kept meticulous notes throughout the experiment." },
    { w: "Ambivalent", ipa: "/æmˈbɪvələnt/", nl: "innerlijk verdeeld, tweeslachtig", ex: "He felt ambivalent about accepting the new job." },
    { w: "Cacophony", ipa: "/kəˈkɒfəni/", nl: "kakofonie, wanklank", ex: "The construction site was a cacophony of drills and hammers." },
    { w: "Resilient", ipa: "/rɪˈzɪliənt/", nl: "veerkrachtig", ex: "Coral reefs can be surprisingly resilient after mild damage." },
    { w: "Pragmatic", ipa: "/præɡˈmætɪk/", nl: "praktisch, zakelijk ingesteld", ex: "They took a pragmatic approach instead of debating theory." },
    { w: "Conundrum", ipa: "/kəˈnʌndrəm/", nl: "raadsel, lastig probleem", ex: "Choosing between the two offers was a real conundrum." },
    { w: "Superfluous", ipa: "/suːˈpɜːfluəs/", nl: "overbodig", ex: "The extra explanation felt superfluous after the demo." },
    { w: "Candid", ipa: "/ˈkændɪd/", nl: "oprecht, openhartig", ex: "I appreciated her candid feedback on my draft." },
    { w: "Elusive", ipa: "/ɪˈluːsɪv/", nl: "ongrijpbaar", ex: "A good night's sleep felt elusive during exam week." },
    { w: "Tenacious", ipa: "/təˈneɪʃəs/", nl: "vasthoudend, hardnekkig", ex: "Her tenacious attitude got the project back on track." },
    { w: "Nuance", ipa: "/ˈnjuːɑːns/", nl: "nuance, subtiel verschil", ex: "The translator captured every nuance of the original text." },
    { w: "Skeptical", ipa: "/ˈskeptɪk(ə)l/", nl: "sceptisch, twijfelend", ex: "He remained skeptical of the claim until he saw the data." },
    { w: "Redundant", ipa: "/rɪˈdʌndənt/", nl: "overbodig, dubbelop", ex: "Half of these steps are redundant now the process is automated." },
    { w: "Coherent", ipa: "/kəʊˈhɪərənt/", nl: "samenhangend, logisch", ex: "His argument was coherent from start to finish." },
    { w: "Arbitrary", ipa: "/ˈɑːbɪtrəri/", nl: "willekeurig", ex: "The deadline seemed arbitrary, with no real reason behind it." },
    { w: "Diligent", ipa: "/ˈdɪlɪdʒənt/", nl: "ijverig, plichtsgetrouw", ex: "The diligent intern double-checked every figure in the report." },
    { w: "Volatile", ipa: "/ˈvɒlətaɪl/", nl: "vluchtig, wisselvallig", ex: "Currency markets have been volatile all month." },
    { w: "Plausible", ipa: "/ˈplɔːzəb(ə)l/", nl: "aannemelijk, geloofwaardig", ex: "It's plausible that the delay was just a shipping error." },
    { w: "Astute", ipa: "/əˈstjuːt/", nl: "schrander, scherpzinnig", ex: "That was an astute observation about the budget." },
    { w: "Frugal", ipa: "/ˈfruːɡ(ə)l/", nl: "spaarzaam, zuinig", ex: "They lived frugally to save for their first house." },
    { w: "Inevitable", ipa: "/ɪnˈevɪtəb(ə)l/", nl: "onvermijdelijk", ex: "With no backup plan, the delay became inevitable." },
    { w: "Subtle", ipa: "/ˈsʌt(ə)l/", nl: "subtiel, fijn", ex: "There was a subtle shift in his tone during the call." },
    { w: "Candor", ipa: "/ˈkændə/", nl: "openhartigheid", ex: "I respect the candor in how she handled the mistake." },
    { w: "Formidable", ipa: "/ˈfɔːmɪdəb(ə)l/", nl: "ontzagwekkend, indrukwekkend sterk", ex: "The rival team proved to be a formidable opponent." },
    { w: "Innate", ipa: "/ɪˈneɪt/", nl: "aangeboren", ex: "Curiosity seems to be an innate trait in most children." },
    { w: "Lucid", ipa: "/ˈluːsɪd/", nl: "helder, begrijpelijk", ex: "He gave a remarkably lucid explanation of the tax rules." },
    { w: "Obsolete", ipa: "/ˈɒbsəliːt/", nl: "verouderd, achterhaald", ex: "That file format has been obsolete for over a decade." },
    { w: "Precarious", ipa: "/prɪˈkeəriəs/", nl: "wankel, onzeker", ex: "The ladder was in a precarious position against the wet wall." },
    { w: "Sporadic", ipa: "/spəˈrædɪk/", nl: "sporadisch, onregelmatig", ex: "We only get sporadic updates from the remote team." },
    { w: "Tangible", ipa: "/ˈtændʒɪb(ə)l/", nl: "tastbaar, concreet", ex: "The new policy finally brought tangible results." },
    { w: "Vindicate", ipa: "/ˈvɪndɪkeɪt/", nl: "rechtvaardigen, in het gelijk stellen", ex: "The test results ultimately vindicated her original theory." },
    { w: "Wary", ipa: "/ˈweəri/", nl: "op zijn hoede, behoedzaam", ex: "Investors grew wary after the second earnings miss." },
    { w: "Zealous", ipa: "/ˈzeləs/", nl: "vurig, ijverig", ex: "A zealous fan base showed up hours before the doors opened." },
    { w: "Ambiguous", ipa: "/æmˈbɪɡjuəs/", nl: "dubbelzinnig, onduidelijk", ex: "The instructions were ambiguous about which file to submit." },
    { w: "Benevolent", ipa: "/bəˈnevələnt/", nl: "welwillend, goedgunstig", ex: "A benevolent donor covered the rest of the shelter's costs." },
    { w: "Concise", ipa: "/kənˈsaɪs/", nl: "beknopt", ex: "Please keep your summary concise, one paragraph is enough." },
    { w: "Deprecate", ipa: "/ˈdeprɪkeɪt/", nl: "afkeuren / uitfaseren (techn.)", ex: "This API method will be deprecated in the next release." },
    { w: "Eloquent", ipa: "/ˈeləkwənt/", nl: "welsprekend", ex: "Her eloquent speech earned a standing ovation." },
    { w: "Feasible", ipa: "/ˈfiːzəb(ə)l/", nl: "haalbaar, uitvoerbaar", ex: "Is it feasible to finish the redesign by Friday?" },
    { w: "Gregarious", ipa: "/ɡrɪˈɡeəriəs/", nl: "gezellig, sociaal", ex: "He's gregarious by nature, always chatting with strangers." },
    { w: "Hindsight", ipa: "/ˈhaɪndsaɪt/", nl: "achteraf bezien, wijsheid achteraf", ex: "In hindsight, we should have tested it a week earlier." },
    { w: "Implicit", ipa: "/ɪmˈplɪsɪt/", nl: "impliciet, stilzwijgend", ex: "There was an implicit agreement that no one would be late." }
  ];

  const CAPITALS = [
    { c: "Netherlands", cap: "Amsterdam" },
    { c: "Belgium", cap: "Brussels" },
    { c: "Germany", cap: "Berlin" },
    { c: "France", cap: "Paris" },
    { c: "Portugal", cap: "Lisbon" },
    { c: "Norway", cap: "Oslo" },
    { c: "Sweden", cap: "Stockholm" },
    { c: "Finland", cap: "Helsinki" },
    { c: "Iceland", cap: "Reykjavik" },
    { c: "Poland", cap: "Warsaw" },
    { c: "Austria", cap: "Vienna" },
    { c: "Switzerland", cap: "Bern" },
    { c: "Ireland", cap: "Dublin" },
    { c: "Greece", cap: "Athens" },
    { c: "Turkey", cap: "Ankara" },
    { c: "Egypt", cap: "Cairo" },
    { c: "Morocco", cap: "Rabat" },
    { c: "Kenya", cap: "Nairobi" },
    { c: "South Africa", cap: "Pretoria" },
    { c: "Nigeria", cap: "Abuja" },
    { c: "Brazil", cap: "Brasilia" },
    { c: "Argentina", cap: "Buenos Aires" },
    { c: "Chile", cap: "Santiago" },
    { c: "Peru", cap: "Lima" },
    { c: "Colombia", cap: "Bogota" },
    { c: "Mexico", cap: "Mexico City" },
    { c: "Canada", cap: "Ottawa" },
    { c: "United States", cap: "Washington" },
    { c: "Japan", cap: "Tokyo" },
    { c: "South Korea", cap: "Seoul" },
    { c: "China", cap: "Beijing" },
    { c: "India", cap: "New Delhi" },
    { c: "Thailand", cap: "Bangkok" },
    { c: "Vietnam", cap: "Hanoi" },
    { c: "Indonesia", cap: "Jakarta" },
    { c: "Australia", cap: "Canberra" },
    { c: "New Zealand", cap: "Wellington" },
    { c: "Denmark", cap: "Copenhagen" },
    { c: "Czech Republic", cap: "Prague" },
    { c: "Hungary", cap: "Budapest" },
    { c: "Romania", cap: "Bucharest" },
    { c: "Ukraine", cap: "Kyiv" },
    { c: "Croatia", cap: "Zagreb" },
    { c: "Spain", cap: "Madrid" },
    { c: "Italy", cap: "Rome" },
    { c: "Israel", cap: "Jerusalem" }
  ];

  /* ---------------------------------------------------------------------
     Date helpers — everything keyed off local calendar day
     --------------------------------------------------------------------- */

  function dayOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    return Math.floor(diff / 86400000);
  }

  function dateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  const today = new Date();
  const doy = dayOfYear(today);
  const todayKey = dateKey(today);
  const seed = hashString(todayKey);

  /* ---------------------------------------------------------------------
     Storage helpers
     --------------------------------------------------------------------- */

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },
    remove(key) { try { localStorage.removeItem(key); } catch (e) {} }
  };

  function isDoneToday(toolId) {
    return store.get(`loop_done_${toolId}`, null) === todayKey;
  }
  function markDoneToday(toolId) {
    store.set(`loop_done_${toolId}`, todayKey);
  }
  function getPR(toolId) {
    return store.get(`loop_pr_${toolId}`, null);
  }
  function setPRIfBetter(toolId, ms) {
    const cur = getPR(toolId);
    if (cur === null || ms < cur) {
      store.set(`loop_pr_${toolId}`, ms);
      return true;
    }
    return false;
  }
  function formatMs(ms) {
    return (ms / 1000).toFixed(1) + "s";
  }

  /* ---------------------------------------------------------------------
     Theme
     --------------------------------------------------------------------- */

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".segmented-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0B0B0D" : "#F3F3F5");
  }

  function initTheme() {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const saved = store.get("loop_theme", prefersDark ? "dark" : "light");
    applyTheme(saved);
    document.getElementById("themeSegmented").addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented-btn");
      if (!btn) return;
      store.set("loop_theme", btn.dataset.theme);
      applyTheme(btn.dataset.theme);
    });
  }

  /* ---------------------------------------------------------------------
     Navigation
     --------------------------------------------------------------------- */

  function showView(name) {
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function initNav() {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => showView(tab.dataset.view));
    });
    document.getElementById("progressPill").addEventListener("click", () => showView("tools"));
  }

  /* ---------------------------------------------------------------------
     Live clock + day-progress ring (signature element)
     --------------------------------------------------------------------- */

  const RING_CIRCUMFERENCE = 2 * Math.PI * 92;

  function tickClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("liveTime").textContent = `${hh}:${mm}`;

    const secondsIntoDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const fraction = secondsIntoDay / 86400;
    const offset = RING_CIRCUMFERENCE * (1 - fraction);
    document.getElementById("dayRingProgress").style.strokeDashoffset = offset.toFixed(1);

    document.getElementById("dateLabel").textContent = now.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric"
    });
  }

  /* ---------------------------------------------------------------------
     Home render
     --------------------------------------------------------------------- */

  function renderHome() {
    const fact = FACTS[doy % FACTS.length];
    document.getElementById("factTitle").textContent = fact.t;
    document.getElementById("factBody").textContent = fact.b;
    document.getElementById("quoteText").textContent = QUOTES[doy % QUOTES.length];
    updateProgressPill();

    const reminderOn = store.get("loop_reminder", false);
    const doneCount = TOOL_DEFS.filter(t => isDoneToday(t.id)).length;
    document.getElementById("reminderBanner").hidden = !(reminderOn && doneCount < TOOL_DEFS.length);
  }

  function updateProgressPill() {
    const doneCount = TOOL_DEFS.filter(t => isDoneToday(t.id)).length;
    document.getElementById("progressText").textContent = `${doneCount}/${TOOL_DEFS.length} challenges done today`;
  }

  /* ---------------------------------------------------------------------
     Facts view — this week only, no looking ahead
     --------------------------------------------------------------------- */

  function renderFacts() {
    const totalWeeks = Math.floor(FACTS.length / 7);
    const weekNum = doy % totalWeeks;
    const weekFacts = FACTS.slice(weekNum * 7, weekNum * 7 + 7);
    const dayInWeek = doy % 7;

    const list = document.getElementById("factsList");
    list.innerHTML = "";
    const dayLabels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

    weekFacts.forEach((fact, i) => {
      const row = document.createElement("div");
      const unlocked = i <= dayInWeek;
      row.className = "fact-row" + (i === dayInWeek ? " is-today" : "") + (!unlocked ? " is-locked" : "");

      if (unlocked) {
        row.innerHTML = `
          <div class="fact-row-day">${dayLabels[i]}</div>
          <div class="fact-row-body">
            <div class="fact-row-title">${fact.t}</div>
            <div class="fact-row-text">${fact.b}</div>
          </div>`;
      } else {
        const daysAway = i - dayInWeek;
        row.innerHTML = `
          <div class="fact-row-day">${dayLabels[i]}</div>
          <div class="fact-row-body">
            <div class="fact-row-locked-text">🔒 Unlocks in ${daysAway} day${daysAway > 1 ? "s" : ""}</div>
          </div>`;
      }
      list.appendChild(row);
    });
  }

  /* ---------------------------------------------------------------------
     Tools view
     --------------------------------------------------------------------- */

  const TOOL_DEFS = [
    { id: "word", title: "English", sub: "Learn one tricky word a day", icon: iconBook, timed: false },
    { id: "clock", title: "Analog Clock", sub: "Read the hands, type the time", icon: iconClock, timed: true },
    { id: "month", title: "Months", sub: "Number to month, as fast as you can", icon: iconCalendar, timed: true },
    { id: "capital", title: "Capitals", sub: "Country to capital city", icon: iconGlobe, timed: true }
  ];

  function iconBook() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M5 5.5C5 4.67 5.67 4 6.5 4H12v16H6.5A1.5 1.5 0 0 1 5 18.5v-13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M19 5.5c0-.83-.67-1.5-1.5-1.5H12v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  }
  function iconClock() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function iconCalendar() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><rect x="4" y="5.5" width="16" height="14.5" rx="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  }
  function iconGlobe() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M3.7 12h16.6M12 3.7c2.4 2.2 3.7 5.1 3.7 8.3s-1.3 6.1-3.7 8.3c-2.4-2.2-3.7-5.1-3.7-8.3S9.6 5.9 12 3.7Z" stroke="currentColor" stroke-width="1.6"/></svg>`;
  }

  function renderTools() {
    const list = document.getElementById("toolsList");
    list.innerHTML = "";
    TOOL_DEFS.forEach(def => {
      const done = isDoneToday(def.id);
      const pr = getPR(def.id);
      const row = document.createElement("button");
      row.className = "tool-row";
      row.type = "button";
      const statusHtml = done
        ? `<span class="tool-status done">Done ✓</span>`
        : `<span class="tool-status pending">New</span>`;
      const subText = def.timed && pr !== null ? `${def.sub} · PR ${formatMs(pr)}` : def.sub;
      row.innerHTML = `
        <div class="tool-icon">${def.icon()}</div>
        <div class="tool-body">
          <div class="tool-title">${def.title}</div>
          <div class="tool-sub">${subText}</div>
        </div>
        ${statusHtml}`;
      row.addEventListener("click", () => openTool(def.id));
      list.appendChild(row);
    });
  }

  /* ---------------------------------------------------------------------
     Overlay plumbing
     --------------------------------------------------------------------- */

  const overlay = document.getElementById("toolOverlay");
  const overlayContent = document.getElementById("overlayContent");

  function openOverlay(html) {
    overlayContent.innerHTML = html;
    overlay.classList.add("open");
  }
  function closeOverlay() {
    overlay.classList.remove("open");
  }
  document.getElementById("overlayClose").addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeOverlay(); });

  function openTool(id) {
    if (isDoneToday(id)) {
      renderDoneState(id);
      return;
    }
    if (id === "word") renderWordTool();
    else if (id === "clock") renderClockTool();
    else if (id === "month") renderMonthTool();
    else if (id === "capital") renderCapitalTool();
  }

  function renderDoneState(id) {
    const def = TOOL_DEFS.find(t => t.id === id);
    const pr = getPR(id);
    openOverlay(`
      <span class="ov-eyebrow">${def.title}</span>
      <h2 class="ov-title">Already done today</h2>
      <div class="ov-done-note">
        Nice work — you've completed today's ${def.title.toLowerCase()} challenge.<br>
        A new one unlocks after midnight.
        ${pr !== null ? `<div class="ov-pr-badge">Personal record: ${formatMs(pr)}</div>` : ""}
      </div>
    `);
  }

  /* --- Tool 1: English word -------------------------------------------- */

  function renderWordTool() {
    const word = WORDS[doy % WORDS.length];
    openOverlay(`
      <span class="ov-eyebrow">English</span>
      <h2 class="ov-title">Word of the day</h2>
      <p class="ov-sub">Read it, learn it, swipe it away when it sticks.</p>
      <div class="ov-big-word" id="wordCard">${word.w}</div>
      <div class="ov-word-ipa">${word.ipa}</div>
      <div class="ov-block">
        <span class="ov-block-label">Dutch</span>
        <div class="ov-block-text">${word.nl}</div>
      </div>
      <div class="ov-block">
        <span class="ov-block-label">Example</span>
        <div class="ov-block-text">${word.ex}</div>
      </div>
      <button class="ov-btn" id="wordDoneBtn">Got it — see you tomorrow</button>
    `);

    const card = document.getElementById("wordCard");
    let startX = null;
    card.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    card.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 80) completeWord();
    });

    document.getElementById("wordDoneBtn").addEventListener("click", completeWord);

    function completeWord() {
      markDoneToday("word");
      renderTools();
      updateProgressPill();
      renderDoneState("word");
    }
  }

  /* --- Tool 2: Analog clock ---------------------------------------------- */

  function renderClockTool() {
    const hour = seed % 12;
    const minute = Math.floor(seed / 13) % 60;
    const startedAt = performance.now();

    openOverlay(`
      <span class="ov-eyebrow">Analog Clock</span>
      <h2 class="ov-title">What time is it?</h2>
      <p class="ov-sub">Read the hands and type the digital time. Five minutes of slack either way.</p>
      <div class="ov-clock-wrap">${buildAnalogClockSVG(hour, minute)}</div>
      <input class="ov-input" id="clockInput" type="time" step="60">
      <button class="ov-btn" id="clockSubmitBtn">Submit</button>
    `);

    document.getElementById("clockSubmitBtn").addEventListener("click", () => {
      const val = document.getElementById("clockInput").value; // "HH:MM"
      if (!val) return;
      const elapsed = performance.now() - startedAt;
      const [gh, gm] = val.split(":").map(Number);
      const guessTotal = (gh % 12) * 60 + gm;
      const actualTotal = hour * 60 + minute;
      let diff = Math.abs(guessTotal - actualTotal);
      diff = Math.min(diff, 720 - diff);
      const correct = diff <= 5;
      finishTimedTool("clock", correct, elapsed, `${String(hour === 0 ? 12 : hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`);
    });
  }

  function buildAnalogClockSVG(hour, minute) {
    const hourAngle = (hour % 12) * 30 + minute * 0.5 - 90;
    const minAngle = minute * 6 - 90;
    const cx = 100, cy = 100;
    const hx = cx + 46 * Math.cos(hourAngle * Math.PI / 180);
    const hy = cy + 46 * Math.sin(hourAngle * Math.PI / 180);
    const mx = cx + 68 * Math.cos(minAngle * Math.PI / 180);
    const my = cy + 68 * Math.sin(minAngle * Math.PI / 180);
    let ticks = "";
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180;
      const x1 = cx + 84 * Math.cos(a), y1 = cy + 84 * Math.sin(a);
      const x2 = cx + 92 * Math.cos(a), y2 = cy + 92 * Math.sin(a);
      ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--divider)" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    return `
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="${cx}" cy="${cy}" r="96" fill="none" stroke="var(--divider)" stroke-width="1.5"/>
        ${ticks}
        <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="var(--text-primary)" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="var(--text-primary)"/>
      </svg>`;
  }

  /* --- Tool 3: Months ------------------------------------------------- */

  const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const MONTH_ABBR = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

  function renderMonthTool() {
    const monthIndex = seed % 12; // 0-11
    const number = monthIndex + 1;
    const startedAt = performance.now();

    openOverlay(`
      <span class="ov-eyebrow">Months</span>
      <h2 class="ov-title">Name that month</h2>
      <p class="ov-sub">Type the English month name as fast as you can.</p>
      <div class="ov-big-number">${number}</div>
      <input class="ov-input" id="monthInput" type="text" placeholder="e.g. march" autocomplete="off" autocapitalize="off">
      <button class="ov-btn" id="monthSubmitBtn">Submit</button>
    `);

    const input = document.getElementById("monthInput");
    input.focus();
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    document.getElementById("monthSubmitBtn").addEventListener("click", submit);

    function submit() {
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const elapsed = performance.now() - startedAt;
      const correct = val === MONTHS[monthIndex] || val === MONTH_ABBR[monthIndex];
      finishTimedTool("month", correct, elapsed, capitalize(MONTHS[monthIndex]));
    }
  }

  /* --- Tool 4: Capitals ------------------------------------------------- */

  function renderCapitalTool() {
    const item = CAPITALS[doy % CAPITALS.length];
    const startedAt = performance.now();

    openOverlay(`
      <span class="ov-eyebrow">Capitals</span>
      <h2 class="ov-title">Name the capital</h2>
      <p class="ov-sub">Type the capital city of this country.</p>
      <div class="ov-big-word">${item.c}</div>
      <input class="ov-input" id="capitalInput" type="text" placeholder="Capital city" autocomplete="off" autocapitalize="off" style="margin-top:22px;">
      <button class="ov-btn" id="capitalSubmitBtn">Submit</button>
    `);

    const input = document.getElementById("capitalInput");
    input.focus();
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    document.getElementById("capitalSubmitBtn").addEventListener("click", submit);

    function submit() {
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const elapsed = performance.now() - startedAt;
      const correct = val === item.cap.toLowerCase();
      finishTimedTool("capital", correct, elapsed, item.cap);
    }
  }

  /* --- Shared result screen for timed tools ------------------------------ */

  function finishTimedTool(id, correct, elapsedMs, correctAnswerLabel) {
    markDoneToday(id);
    const isNewPR = correct ? setPRIfBetter(id, elapsedMs) : false;
    const pr = getPR(id);

    openOverlay(`
      <div class="ov-result">
        <div class="ov-result-icon ${correct ? "ok" : "no"}">
          ${correct ? checkIconSVG() : crossIconSVG()}
        </div>
        <div class="ov-result-title">${correct ? "Correct!" : "Not quite"}</div>
        <div class="ov-result-sub">
          ${correct ? `Solved in ${formatMs(elapsedMs)}.` : `The answer was ${correctAnswerLabel}.`}
        </div>
        <div class="ov-result-sub">Come back tomorrow for a new one.</div>
        ${isNewPR ? `<div class="ov-pr-badge">🎉 New personal record</div>` : (pr !== null ? `<div class="ov-pr-badge">Best: ${formatMs(pr)}</div>` : "")}
      </div>
    `);
    renderTools();
    updateProgressPill();
  }

  function checkIconSVG() {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function crossIconSVG() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------------------------------------------------------------------
     Settings
     --------------------------------------------------------------------- */

  function initSettings() {
    const reminderSwitch = document.getElementById("reminderSwitch");
    const reminderOn = store.get("loop_reminder", false);
    reminderSwitch.classList.toggle("on", reminderOn);
    reminderSwitch.setAttribute("aria-checked", String(reminderOn));
    reminderSwitch.addEventListener("click", () => {
      const next = !reminderSwitch.classList.contains("on");
      reminderSwitch.classList.toggle("on", next);
      reminderSwitch.setAttribute("aria-checked", String(next));
      store.set("loop_reminder", next);
      renderHome();
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      const ok = confirm("Reset all progress and personal records? This can't be undone.");
      if (!ok) return;
      TOOL_DEFS.forEach(def => {
        store.remove(`loop_done_${def.id}`);
        store.remove(`loop_pr_${def.id}`);
      });
      renderTools();
      renderHome();
    });

    // Install prompt (Android/desktop Chrome). iOS has no install event —
    // the hint text covers that path instead.
    const installBtn = document.getElementById("installBtn");
    const installHint = document.getElementById("installHint");
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.hidden = false;
      installHint.textContent = "Install Loop as an app on this device.";
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.hidden = true;
    });

    if (isIOS) {
      installHint.textContent = "On iPhone/iPad: tap Share, then \"Add to Home Screen\".";
    } else if (!("onbeforeinstallprompt" in window)) {
      installHint.textContent = "Use your browser's menu and look for \"Add to Home Screen\" or \"Install app\".";
    }
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */

  function boot() {
    initTheme();
    initNav();
    initSettings();
    renderHome();
    renderFacts();
    renderTools();
    tickClock();
    setInterval(tickClock, 1000);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
