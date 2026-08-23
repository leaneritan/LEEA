/**
 * A way back out of a math lesson.
 *
 * The standalone lessons under public/math-lessons/ open in a new tab from a
 * button on a section page or the curriculum home. Once there, none of them
 * offered any route back into LEEA — thirteen files, zero links home — so the
 * only exit was the browser's own controls. This adds one fixed button.
 *
 * Where it points is read from the lesson's own filename, which already encodes
 * where it belongs: `...-ch3-sec1-p92-95.html` goes back to 3章1節, a name with
 * only `-ch1` (or none at all) goes back to the math home. Nothing to configure
 * per lesson, and a lesson renamed to the convention picks it up for free.
 *
 * Exposes window.buildMathLessonHome(options) and self-installs on load, so a
 * lesson needs one script tag and no call.
 */
(function () {
  var SECTION_PATTERN = /-ch(\d+)-sec(\d+)(?:[-.]|$)/;

  /** Where this lesson sits, from its own URL. Null when the name says nothing. */
  function readOrigin(pathname) {
    var file = String(pathname || "").split("/").pop() || "";
    var match = file.match(SECTION_PATTERN);
    if (!match) return null;
    var chapter = match[1];
    var section = match[2];
    return {
      href: "/math/" + chapter + "/math-" + chapter + "-" + section,
      label: "← " + chapter + "章" + section + "節へ"
    };
  }

  function buildMathLessonHome(options) {
    var config = options || {};
    var doc = config.document || document;

    // Inside the app's own viewer the frame already has a back link; a second
    // one pointing out of the iframe would be worse than none.
    if (!config.force && typeof window !== "undefined" && window.top !== window.self) return null;
    if (doc.querySelector(".leea-lesson-home")) return null;

    var origin = readOrigin(config.pathname || (typeof location !== "undefined" ? location.pathname : ""));
    var link = doc.createElement("a");
    link.className = "leea-lesson-home";
    link.href = config.href || (origin ? origin.href : "/math");
    link.textContent = config.label || (origin ? origin.label : "← 数学の学び");
    link.title = "LEEA の数学にもどる";

    var style = doc.createElement("style");
    style.textContent = [
      ".leea-lesson-home{position:fixed;left:14px;top:14px;z-index:2147483000;",
      "display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:999px;",
      "font-family:inherit;font-size:13px;font-weight:800;line-height:1;text-decoration:none;",
      "color:#4a3c2a;background:rgba(255,255,255,.94);border:1.5px solid rgba(74,60,42,.28);",
      "box-shadow:0 2px 10px rgba(0,0,0,.13);backdrop-filter:blur(4px);",
      "transition:background .15s ease,color .15s ease,transform .15s ease}",
      ".leea-lesson-home:hover{background:#4a3c2a;color:#fff;border-color:#4a3c2a;transform:translateY(-1px)}",
      ".leea-lesson-home:focus-visible{outline:3px solid #c98a2e;outline-offset:2px}",
      "@media print{.leea-lesson-home{display:none}}",
      "@media (max-width:640px){.leea-lesson-home{left:8px;top:8px;padding:7px 12px;font-size:12px}}"
    ].join("");

    doc.head.appendChild(style);
    doc.body.appendChild(link);
    return link;
  }

  if (typeof window !== "undefined") {
    window.buildMathLessonHome = buildMathLessonHome;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        buildMathLessonHome();
      });
    } else {
      buildMathLessonHome();
    }
  }
})();
