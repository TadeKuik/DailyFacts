/* ==========================================================================
   Loop — app logic
   Content is deterministic per calendar day (local time). Tool completions,
   PRs, and streaks are stored in localStorage, and mirrored to Firestore
   when the user is signed in (see the Firebase section near the bottom).
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
    { c: "Netherlands", cap: "Amsterdam", flag: "🇳🇱" },
    { c: "Belgium", cap: "Brussels", flag: "🇧🇪" },
    { c: "Germany", cap: "Berlin", flag: "🇩🇪" },
    { c: "France", cap: "Paris", flag: "🇫🇷" },
    { c: "Portugal", cap: "Lisbon", flag: "🇵🇹" },
    { c: "Norway", cap: "Oslo", flag: "🇳🇴" },
    { c: "Sweden", cap: "Stockholm", flag: "🇸🇪" },
    { c: "Finland", cap: "Helsinki", flag: "🇫🇮" },
    { c: "Iceland", cap: "Reykjavik", flag: "🇮🇸" },
    { c: "Poland", cap: "Warsaw", flag: "🇵🇱" },
    { c: "Austria", cap: "Vienna", flag: "🇦🇹" },
    { c: "Switzerland", cap: "Bern", flag: "🇨🇭" },
    { c: "Ireland", cap: "Dublin", flag: "🇮🇪" },
    { c: "Greece", cap: "Athens", flag: "🇬🇷" },
    { c: "Turkey", cap: "Ankara", flag: "🇹🇷" },
    { c: "Egypt", cap: "Cairo", flag: "🇪🇬" },
    { c: "Morocco", cap: "Rabat", flag: "🇲🇦" },
    { c: "Kenya", cap: "Nairobi", flag: "🇰🇪" },
    { c: "South Africa", cap: "Pretoria", flag: "🇿🇦" },
    { c: "Nigeria", cap: "Abuja", flag: "🇳🇬" },
    { c: "Brazil", cap: "Brasilia", flag: "🇧🇷" },
    { c: "Argentina", cap: "Buenos Aires", flag: "🇦🇷" },
    { c: "Chile", cap: "Santiago", flag: "🇨🇱" },
    { c: "Peru", cap: "Lima", flag: "🇵🇪" },
    { c: "Colombia", cap: "Bogota", flag: "🇨🇴" },
    { c: "Mexico", cap: "Mexico City", flag: "🇲🇽" },
    { c: "Canada", cap: "Ottawa", flag: "🇨🇦" },
    { c: "United States", cap: "Washington", flag: "🇺🇸" },
    { c: "Japan", cap: "Tokyo", flag: "🇯🇵" },
    { c: "South Korea", cap: "Seoul", flag: "🇰🇷" },
    { c: "China", cap: "Beijing", flag: "🇨🇳" },
    { c: "India", cap: "New Delhi", flag: "🇮🇳" },
    { c: "Thailand", cap: "Bangkok", flag: "🇹🇭" },
    { c: "Vietnam", cap: "Hanoi", flag: "🇻🇳" },
    { c: "Indonesia", cap: "Jakarta", flag: "🇮🇩" },
    { c: "Australia", cap: "Canberra", flag: "🇦🇺" },
    { c: "New Zealand", cap: "Wellington", flag: "🇳🇿" },
    { c: "Denmark", cap: "Copenhagen", flag: "🇩🇰" },
    { c: "Czech Republic", cap: "Prague", flag: "🇨🇿" },
    { c: "Hungary", cap: "Budapest", flag: "🇭🇺" },
    { c: "Romania", cap: "Bucharest", flag: "🇷🇴" },
    { c: "Ukraine", cap: "Kyiv", flag: "🇺🇦" },
    { c: "Croatia", cap: "Zagreb", flag: "🇭🇷" },
    { c: "Spain", cap: "Madrid", flag: "🇪🇸" },
    { c: "Italy", cap: "Rome", flag: "🇮🇹" },
    { c: "Israel", cap: "Jerusalem", flag: "🇮🇱" }
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

  function seededInt(label, min, max) {
    const h = hashString(todayKey + ":" + label);
    return min + (h % (max - min + 1));
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
     Streak
     --------------------------------------------------------------------- */

  function yesterdayKey() {
    return dateKey(new Date(Date.now() - 86400000));
  }

  function recalcStreakOnLoad() {
    const last = store.get("loop_streak_last_date", null);
    if (!last) return;
    if (last !== todayKey && last !== yesterdayKey()) {
      const wasActive = store.get("loop_streak_current", 0) > 0;
      store.set("loop_streak_current", 0);
      if (wasActive) store.set("loop_streak_ever_reset", true);
    }
  }

  function recordCompletedDay(dateStr) {
    const hist = store.get("loop_completed_dates", []);
    if (!hist.includes(dateStr)) {
      hist.push(dateStr);
      while (hist.length > 120) hist.shift();
      store.set("loop_completed_dates", hist);
    }
  }

  const STREAK_MILESTONES = [7, 30, 100];

  function maybeBumpStreak() {
    const allDone = TOOL_DEFS.every(t => isDoneToday(t.id));
    if (!allDone) { renderStreakBadge(); return; }
    const last = store.get("loop_streak_last_date", null);
    if (last === todayKey) { renderStreakBadge(); return; }
    const current = (last === yesterdayKey()) ? store.get("loop_streak_current", 0) + 1 : 1;
    store.set("loop_streak_current", current);
    store.set("loop_streak_last_date", todayKey);
    const longest = store.get("loop_streak_longest", 0);
    if (current > longest) store.set("loop_streak_longest", current);
    recordCompletedDay(todayKey);
    renderStreakBadge();
    if (STREAK_MILESTONES.includes(current)) fireConfetti();
  }

  function renderStreakBadge() {
    const el = document.getElementById("streakCount");
    if (el) el.textContent = store.get("loop_streak_current", 0);
  }

  function markDoneToday(toolId) {
    const wasDone = isDoneToday(toolId);
    store.set(`loop_done_${toolId}`, todayKey);
    if (!wasDone) {
      store.set("loop_total_completed", store.get("loop_total_completed", 0) + 1);
      store.set(`loop_count_${toolId}`, store.get(`loop_count_${toolId}`, 0) + 1);
    }
    maybeBumpStreak();
    checkBadges();
  }

  /* ---------------------------------------------------------------------
     Confetti — small celebratory burst on streak milestones
     --------------------------------------------------------------------- */

  function fireConfetti() {
    const layer = document.getElementById("confettiLayer");
    if (!layer) return;
    const colors = ["#C97A3D", "#6B7686", "#3F8F5F", "#8A6B8F", "#4B5563", "#B0564A"];
    for (let i = 0; i < 28; i++) {
      const el = document.createElement("span");
      el.className = "confetti-piece";
      el.style.left = (Math.random() * 100).toFixed(1) + "%";
      el.style.background = colors[i % colors.length];
      el.style.animationDelay = (Math.random() * 0.35).toFixed(2) + "s";
      el.style.setProperty("--drift", (Math.random() * 2 - 1).toFixed(2));
      layer.appendChild(el);
      setTimeout(() => el.remove(), 2700);
    }
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
      syncNow();
    });
  }

  /* ---------------------------------------------------------------------
     Navigation
     --------------------------------------------------------------------- */

  function showView(name) {
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
    window.scrollTo({ top: 0 });
  }

  function initNav() {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => showView(tab.dataset.view));
    });
    document.getElementById("progressPill").addEventListener("click", () => showView("tools"));
  }

  /* ---------------------------------------------------------------------
     Live clock + day-progress ring
     --------------------------------------------------------------------- */

  const RING_CIRCUMFERENCE = 2 * Math.PI * 92;

  function tickClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("liveHours").textContent = hh;
    document.getElementById("liveMinutes").textContent = mm;
    document.getElementById("liveSeconds").textContent = ss;

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
     Facts view
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
  function iconFlag() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M6 21V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 4.5c2-1.3 4-1.3 6 0s4 1.3 6 0v8c-2 1.3-4 1.3-6 0s-4-1.3-6 0v-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  }
  function iconMath() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" stroke-width="1.6"/><line x1="7.5" y1="8" x2="16.5" y2="8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="12.2" r="1" fill="currentColor"/><circle cx="12" cy="12.2" r="1" fill="currentColor"/><circle cx="16" cy="12.2" r="1" fill="currentColor"/><circle cx="8" cy="16.2" r="1" fill="currentColor"/><circle cx="12" cy="16.2" r="1" fill="currentColor"/><circle cx="16" cy="16.2" r="1" fill="currentColor"/></svg>`;
  }
  function iconRoman() {
    return `<svg viewBox="0 0 24 24" width="20" height="20"><text x="12" y="16" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="700" fill="currentColor">XII</text></svg>`;
  }

  const TOOL_DEFS = [
    { id: "word", title: "English", sub: "Learn one tricky word a day", icon: iconBook, timed: false },
    { id: "clock", title: "Analog Clock", sub: "Read the hands, type the time", icon: iconClock, timed: true },
    { id: "month", title: "Months", sub: "Number to month, as fast as you can", icon: iconCalendar, timed: true },
    { id: "capital", title: "Capitals", sub: "Country to capital city", icon: iconGlobe, timed: true },
    { id: "flag", title: "Flags", sub: "Flag to country name", icon: iconFlag, timed: true },
    { id: "math", title: "Math Sprint", sub: "Solve it as fast as you can", icon: iconMath, timed: true },
    { id: "roman", title: "Roman Numerals", sub: "Numeral to number", icon: iconRoman, timed: true }
  ];

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
    if (isDoneToday(id)) { renderDoneState(id); return; }
    if (id === "word") renderWordTool();
    else if (id === "clock") renderClockTool();
    else if (id === "month") renderMonthTool();
    else if (id === "capital") renderCapitalTool();
    else if (id === "flag") renderFlagTool();
    else if (id === "math") renderMathTool();
    else if (id === "roman") renderRomanTool();
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

  /* --- Tool: English word -------------------------------------------- */

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
      syncNow();
    }
  }

  /* --- Tool: Analog clock ---------------------------------------------- */

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
      const val = document.getElementById("clockInput").value;
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

  /* --- Tool: Months ------------------------------------------------- */

  const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const MONTH_ABBR = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

  function renderMonthTool() {
    const monthIndex = seed % 12;
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

  /* --- Tool: Capitals ------------------------------------------------- */

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

  /* --- Tool: Flags ------------------------------------------------------ */

  function renderFlagTool() {
    const item = CAPITALS[doy % CAPITALS.length];
    const startedAt = performance.now();

    openOverlay(`
      <span class="ov-eyebrow">Flags</span>
      <h2 class="ov-title">Name the country</h2>
      <p class="ov-sub">Type the country this flag belongs to.</p>
      <div class="ov-big-word" style="font-size:64px;">${item.flag}</div>
      <input class="ov-input" id="flagInput" type="text" placeholder="Country" autocomplete="off" autocapitalize="off" style="margin-top:22px;">
      <button class="ov-btn" id="flagSubmitBtn">Submit</button>
    `);

    const input = document.getElementById("flagInput");
    input.focus();
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    document.getElementById("flagSubmitBtn").addEventListener("click", submit);

    function submit() {
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const elapsed = performance.now() - startedAt;
      const correct = val === item.c.toLowerCase();
      finishTimedTool("flag", correct, elapsed, item.c);
    }
  }

  /* --- Tool: Math Sprint -------------------------------------------------- */

  function getMathProblem() {
    const opIdx = seededInt("math-op", 0, 2);
    let a, b, symbol, answer;
    if (opIdx === 0) { a = seededInt("math-a", 10, 89); b = seededInt("math-b", 10, 89); symbol = "+"; answer = a + b; }
    else if (opIdx === 1) { a = seededInt("math-a", 30, 99); b = seededInt("math-b", 1, 29); symbol = "−"; answer = a - b; }
    else { a = seededInt("math-a", 2, 12); b = seededInt("math-b", 2, 12); symbol = "×"; answer = a * b; }
    return { a, b, symbol, answer };
  }

  function renderMathTool() {
    const p = getMathProblem();
    const startedAt = performance.now();

    openOverlay(`
      <span class="ov-eyebrow">Math Sprint</span>
      <h2 class="ov-title">Solve it</h2>
      <p class="ov-sub">Type the answer as fast as you can.</p>
      <div class="ov-big-number">${p.a} ${p.symbol} ${p.b}</div>
      <input class="ov-input" id="mathInput" type="text" inputmode="numeric" placeholder="Answer" autocomplete="off">
      <button class="ov-btn" id="mathSubmitBtn">Submit</button>
    `);

    const input = document.getElementById("mathInput");
    input.focus();
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    document.getElementById("mathSubmitBtn").addEventListener("click", submit);

    function submit() {
      const val = input.value.trim();
      if (!val) return;
      const elapsed = performance.now() - startedAt;
      const correct = parseInt(val, 10) === p.answer;
      finishTimedTool("math", correct, elapsed, String(p.answer));
    }
  }

  /* --- Tool: Roman Numerals (numeral shown, type the number) ------------- */

  const ROMAN_PAIRS = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  function toRoman(num) {
    let res = "";
    for (const [v, s] of ROMAN_PAIRS) { while (num >= v) { res += s; num -= v; } }
    return res;
  }

  function renderRomanTool() {
    const number = seededInt("roman", 1, 99);
    const numeral = toRoman(number);
    const startedAt = performance.now();

    openOverlay(`
      <span class="ov-eyebrow">Roman Numerals</span>
      <h2 class="ov-title">What number is this?</h2>
      <p class="ov-sub">Type the number this Roman numeral represents.</p>
      <div class="ov-big-number" style="font-family:var(--font-display); font-size:52px;">${numeral}</div>
      <input class="ov-input" id="romanInput" type="text" inputmode="numeric" placeholder="e.g. 47" autocomplete="off">
      <button class="ov-btn" id="romanSubmitBtn">Submit</button>
    `);

    const input = document.getElementById("romanInput");
    input.focus();
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    document.getElementById("romanSubmitBtn").addEventListener("click", submit);

    function submit() {
      const val = input.value.trim();
      if (!val) return;
      const elapsed = performance.now() - startedAt;
      const correct = parseInt(val, 10) === number;
      finishTimedTool("roman", correct, elapsed, String(number));
    }
  }

  /* --- Shared result screen for timed tools ------------------------------ */

  function finishTimedTool(id, correct, elapsedMs, correctAnswerLabel) {
    markDoneToday(id);
    const isNewPR = correct ? setPRIfBetter(id, elapsedMs) : false;
    checkBadges();
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
    syncNow();
  }

  function checkIconSVG() {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function crossIconSVG() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------------------------------------------------------------------
     Stats & badges
     --------------------------------------------------------------------- */

  const BADGES = [
    { id: "first", emoji: "🌱", name: "First Steps", desc: "Complete your first challenge", target: 1, current: s => s.total, check: s => s.total >= 1 },
    { id: "week", emoji: "🔥", name: "Week Warrior", desc: "Reach a 7-day streak", target: 7, current: s => s.longest, check: s => s.longest >= 7 },
    { id: "month", emoji: "🏆", name: "Habit Formed", desc: "Reach a 30-day streak", target: 30, current: s => s.longest, check: s => s.longest >= 30 },
    { id: "century", emoji: "💯", name: "Centurion", desc: "Reach a 100-day streak", target: 100, current: s => s.longest, check: s => s.longest >= 100 },
    { id: "quarter", emoji: "⭐", name: "Quarter Century", desc: "Complete 25 challenges total", target: 25, current: s => s.total, check: s => s.total >= 25 },
    { id: "hundred", emoji: "🎖️", name: "Century Club", desc: "Complete 100 challenges total", target: 100, current: s => s.total, check: s => s.total >= 100 },
    { id: "fast", emoji: "⚡", name: "Lightning Fast", desc: "Score a PR under 2 seconds", target: 1, current: s => s.anyFastPR ? 1 : 0, check: s => s.anyFastPR },
    { id: "wordsmith", emoji: "🧠", name: "Wordsmith", desc: "Complete English 15 times", target: 15, current: s => s.counts.word || 0, check: s => (s.counts.word || 0) >= 15 },
    { id: "timekeeper", emoji: "🕰️", name: "Timekeeper", desc: "Complete Analog Clock 15 times", target: 15, current: s => s.counts.clock || 0, check: s => (s.counts.clock || 0) >= 15 },
    { id: "globetrotter", emoji: "🌍", name: "Globetrotter", desc: "Complete Capitals + Flags 20 times combined", target: 20, current: s => (s.counts.capital || 0) + (s.counts.flag || 0), check: s => ((s.counts.capital || 0) + (s.counts.flag || 0)) >= 20 },
    { id: "cruncher", emoji: "🔢", name: "Number Cruncher", desc: "Complete Math Sprint + Roman Numerals 20 times combined", target: 20, current: s => (s.counts.math || 0) + (s.counts.roman || 0), check: s => ((s.counts.math || 0) + (s.counts.roman || 0)) >= 20 },
    { id: "comeback", emoji: "💪", name: "Comeback Kid", desc: "Rebuild your streak to 3+ after it broke", target: 3, current: s => s.everReset ? Math.min(s.current, 3) : 0, check: s => s.current >= 3 && s.everReset }
  ];

  function computeStats() {
    const counts = {};
    TOOL_DEFS.forEach(t => { counts[t.id] = store.get(`loop_count_${t.id}`, 0); });
    return {
      current: store.get("loop_streak_current", 0),
      longest: store.get("loop_streak_longest", 0),
      total: store.get("loop_total_completed", 0),
      everReset: store.get("loop_streak_ever_reset", false),
      anyFastPR: TOOL_DEFS.some(t => { const pr = getPR(t.id); return pr !== null && pr < 2000; }),
      counts
    };
  }

  function getUnlockedBadgeIds() {
    return store.get("loop_badges_unlocked", []);
  }

  function checkBadges() {
    const stats = computeStats();
    const unlocked = new Set(getUnlockedBadgeIds());
    const newly = [];
    BADGES.forEach(b => {
      if (!unlocked.has(b.id) && b.check(stats)) {
        unlocked.add(b.id);
        newly.push(b);
      }
    });
    if (newly.length) {
      store.set("loop_badges_unlocked", Array.from(unlocked));
      newly.forEach(b => queueBadgeToast(b));
    }
  }

  /* ---- Badge unlock toast ---- */

  const badgeToastQueue = [];
  let badgeToastShowing = false;

  function queueBadgeToast(badge) {
    badgeToastQueue.push(badge);
    if (!badgeToastShowing) showNextBadgeToast();
  }

  function showNextBadgeToast() {
    const badge = badgeToastQueue.shift();
    if (!badge) { badgeToastShowing = false; return; }
    badgeToastShowing = true;
    const toast = document.getElementById("badgeToast");
    toast.innerHTML = `
      <span class="badge-toast-emoji">${badge.emoji}</span>
      <span class="badge-toast-text">
        <span class="badge-toast-title">New badge unlocked</span>
        <span class="badge-toast-name">${badge.name}</span>
      </span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(showNextBadgeToast, 400);
    }, 3200);
  }

  /* ---- Streak calendar (heatmap) ---- */

  function buildHeatmap() {
    const hist = store.get("loop_completed_dates", []);
    const days = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = dateKey(d);
      days.push({ key, done: hist.includes(key), isToday: key === todayKey });
    }
    return days.map(d => `<div class="heatmap-cell ${d.done ? "done" : ""} ${d.isToday ? "is-today" : ""}" title="${d.key}"></div>`).join("");
  }

  function openStats() {
    const s = computeStats();
    const unlockedIds = getUnlockedBadgeIds();
    const prRows = TOOL_DEFS.filter(t => t.timed).map(t => {
      const pr = getPR(t.id);
      return `<div class="pr-row"><span>${t.title}</span><span>${pr !== null ? formatMs(pr) : "—"}</span></div>`;
    }).join("");
    const badgeItems = BADGES.map(b => {
      const unlocked = unlockedIds.includes(b.id);
      const cur = Math.min(b.current(s), b.target);
      const progressText = unlocked ? "Unlocked" : `${cur}/${b.target}`;
      return `<div class="badge-item ${unlocked ? "unlocked" : "locked"}" title="${b.desc}">
        <span class="badge-emoji">${b.emoji}</span>
        <span class="badge-name">${b.name}</span>
        <span class="badge-progress">${progressText}</span>
      </div>`;
    }).join("");

    openOverlay(`
      <span class="ov-eyebrow">Progress</span>
      <h2 class="ov-title">Stats &amp; badges</h2>
      <div class="stats-block-row">
        <div class="stats-metric"><div class="stats-metric-value">${s.current}</div><div class="stats-metric-label">Current streak</div></div>
        <div class="stats-metric"><div class="stats-metric-value">${s.longest}</div><div class="stats-metric-label">Longest streak</div></div>
        <div class="stats-metric"><div class="stats-metric-value">${s.total}</div><div class="stats-metric-label">Total completed</div></div>
      </div>
      <span class="ov-block-label" style="display:block; margin-bottom:8px;">Last 5 weeks</span>
      <div class="heatmap-grid">${buildHeatmap()}</div>
      <span class="ov-block-label" style="display:block; margin:20px 0 8px;">Personal records</span>
      <div class="pr-list">${prRows}</div>
      <span class="ov-block-label" style="display:block; margin:20px 0 8px;">Badges</span>
      <div class="badges-grid">${badgeItems}</div>
    `);
  }

  /* ---------------------------------------------------------------------
     Settings (non-account)
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
      syncNow();
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      const ok = confirm("Reset all progress, streak, and personal records? This can't be undone.");
      if (!ok) return;
      TOOL_DEFS.forEach(def => {
        store.remove(`loop_done_${def.id}`);
        store.remove(`loop_pr_${def.id}`);
        store.remove(`loop_count_${def.id}`);
      });
      store.remove("loop_streak_current");
      store.remove("loop_streak_longest");
      store.remove("loop_streak_last_date");
      store.remove("loop_streak_ever_reset");
      store.remove("loop_total_completed");
      store.remove("loop_completed_dates");
      store.remove("loop_badges_unlocked");
      renderTools();
      renderHome();
      renderStreakBadge();
      syncNow();
    });

    document.getElementById("streakPill").addEventListener("click", openStats);
    document.getElementById("statsBtn").addEventListener("click", openStats);

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
     Firebase — auth + cloud sync (optional; app works fully without it)
     --------------------------------------------------------------------- */

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBDIneVHhnYBwA5cbLXUKNe8DUsODaobco",
    authDomain: "loop-38c98.firebaseapp.com",
    projectId: "loop-38c98",
    storageBucket: "loop-38c98.firebasestorage.app",
    messagingSenderId: "500963679677",
    appId: "1:500963679677:web:3ea2c45ab6fc5b3509c6d4"
  };

  let fbAuth = null, fbDb = null, fbUser = null, firebaseOK = false;
  let authFns = {}, fsFns = {};

  const SYNC_FIXED_KEYS = [
    "loop_theme", "loop_reminder",
    "loop_streak_current", "loop_streak_longest", "loop_streak_last_date", "loop_streak_ever_reset",
    "loop_total_completed", "loop_completed_dates", "loop_badges_unlocked"
  ];

  function collectSyncData() {
    const data = {};
    SYNC_FIXED_KEYS.forEach(k => { data[k] = store.get(k, null); });
    TOOL_DEFS.forEach(t => {
      data[`loop_done_${t.id}`] = store.get(`loop_done_${t.id}`, null);
      data[`loop_pr_${t.id}`] = store.get(`loop_pr_${t.id}`, null);
      data[`loop_count_${t.id}`] = store.get(`loop_count_${t.id}`, null);
    });
    return data;
  }

  function applySyncData(data) {
    Object.keys(data).forEach(k => {
      if (data[k] !== null && data[k] !== undefined) store.set(k, data[k]);
    });
  }

  async function pushToCloud() {
    if (!firebaseOK || !fbUser) return;
    try { await fsFns.setDoc(fsFns.doc(fbDb, "users", fbUser.uid), collectSyncData()); }
    catch (e) { console.warn("Cloud save failed:", e); }
  }

  async function pullFromCloud() {
    if (!firebaseOK || !fbUser) return;
    try {
      const snap = await fsFns.getDoc(fsFns.doc(fbDb, "users", fbUser.uid));
      if (snap.exists()) applySyncData(snap.data());
      else await pushToCloud();
    } catch (e) { console.warn("Cloud load failed:", e); }
  }

  function syncNow() { if (firebaseOK && fbUser) pushToCloud(); }

  function showAuthError(msg) {
    const el = document.getElementById("authError");
    el.textContent = msg;
    el.hidden = false;
  }
  function clearAuthError() {
    const el = document.getElementById("authError");
    el.hidden = true;
    el.textContent = "";
  }

  function friendlyAuthError(e) {
    const code = (e && e.code) || "";
    if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
    if (code.includes("user-not-found")) return "No account found with that email.";
    if (code.includes("email-already-in-use")) return "That email is already registered — try signing in instead.";
    if (code.includes("invalid-email")) return "That doesn't look like a valid email.";
    if (code.includes("weak-password")) return "Password must be at least 6 characters.";
    if (code.includes("popup-closed-by-user")) return "Sign-in was cancelled.";
    return "Something went wrong. Please try again.";
  }

  function wireAuthUI() {
    document.getElementById("googleSignInBtn").hidden = false;
    document.getElementById("authDivider").hidden = false;
    document.getElementById("authEmail").hidden = false;
    document.getElementById("authPassword").hidden = false;
    document.getElementById("authBtnRow").hidden = false;

    document.getElementById("googleSignInBtn").addEventListener("click", async () => {
      clearAuthError();
      try {
        const provider = new authFns.GoogleAuthProvider();
        await authFns.signInWithPopup(fbAuth, provider);
      } catch (e) { showAuthError(friendlyAuthError(e)); }
    });

    document.getElementById("emailSignInBtn").addEventListener("click", async () => {
      clearAuthError();
      const email = document.getElementById("authEmail").value.trim();
      const pass = document.getElementById("authPassword").value;
      if (!email || !pass) { showAuthError("Enter your email and password."); return; }
      try { await authFns.signInWithEmailAndPassword(fbAuth, email, pass); }
      catch (e) { showAuthError(friendlyAuthError(e)); }
    });

    document.getElementById("emailSignUpBtn").addEventListener("click", async () => {
      clearAuthError();
      const email = document.getElementById("authEmail").value.trim();
      const pass = document.getElementById("authPassword").value;
      if (!email || !pass) { showAuthError("Enter your email and password."); return; }
      if (pass.length < 6) { showAuthError("Password must be at least 6 characters."); return; }
      try { await authFns.createUserWithEmailAndPassword(fbAuth, email, pass); }
      catch (e) { showAuthError(friendlyAuthError(e)); }
    });

    document.getElementById("signOutBtn").addEventListener("click", () => {
      authFns.signOut(fbAuth);
    });
  }

  async function handleAuthChange(user) {
    fbUser = user;
    const title = document.getElementById("accountStatusTitle");
    const sub = document.getElementById("accountStatusSub");
    const signOutBtn = document.getElementById("signOutBtn");
    const signedOutBlock = document.getElementById("signedOutBlock");

    if (user) {
      title.textContent = user.displayName || user.email || "Signed in";
      sub.textContent = "Your progress is synced to this account.";
      signOutBtn.hidden = false;
      signedOutBlock.hidden = true;
      clearAuthError();
      await pullFromCloud();
      applyTheme(store.get("loop_theme", "light"));
      recalcStreakOnLoad();
      renderHome();
      renderFacts();
      renderTools();
      renderStreakBadge();
      checkBadges();
    } else {
      title.textContent = "Not signed in";
      sub.textContent = "Sign in to save your progress across devices.";
      signOutBtn.hidden = true;
      signedOutBlock.hidden = false;
    }
  }

  async function initFirebase() {
    try {
      const [{ initializeApp }, authMod, fsMod] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js")
      ]);
      const app = initializeApp(FIREBASE_CONFIG);
      fbAuth = authMod.getAuth(app);
      fbDb = fsMod.getFirestore(app);
      authFns = authMod;
      fsFns = fsMod;
      firebaseOK = true;
      wireAuthUI();
      authMod.onAuthStateChanged(fbAuth, handleAuthChange);
    } catch (e) {
      console.warn("Firebase unavailable:", e);
      const note = document.getElementById("cloudSyncNote");
      if (note) note.hidden = false;
    }
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */

  function boot() {
    initTheme();
    initNav();
    initSettings();
    recalcStreakOnLoad();
    renderHome();
    renderFacts();
    renderTools();
    renderStreakBadge();
    checkBadges();
    tickClock();
    setInterval(tickClock, 1000);
    initFirebase();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
