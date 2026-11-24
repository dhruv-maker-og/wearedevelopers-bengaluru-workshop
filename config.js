(function initializeWorkshopConfig(root, factory) {
  const config = factory();
  root.WORKSHOP_CONFIG = config;
  if (typeof module === "object" && module.exports) {
    module.exports = config;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createWorkshopConfig() {
  "use strict";

  // WORKSHOP URL CONFIGURATION
  // Update these organizer-controlled destinations first, then run npm run qr:generate.
  return Object.freeze({
    copilotAppWindows: "https://gh.io/copilot-app-win6",
    copilotAppDocs:
      "https://docs.github.com/en/copilot/concepts/copilot-surfaces/github-copilot-app",
    workshopJoin:
      "https://polite-glacier-0ea2cfe0f.7.azurestaticapps.net/#token=eyJ2IjozLCJpc3N1ZSI6NzQwLCJvcmciOiJoYWNrYXRob24tYmx1ZS10dW5hLTE5IiwiZXZlbnQiOiJXZUFyZURldmVsb3BlciB8IEJlbmdhbHVydSB8IDI1dGggTm92IHwgSVNUIiwiZGF0ZSI6IjIwMjYtMTEtMjUiLCJvcmdhbml6ZXJzIjpbImRocnV2LW1ha2VyLW9nIiwicHJhZGVlcGt1MDciXSwibmJmIjoxNzk1NTIxMjI1LCJleHAiOjE3OTU4MjQwMDAsImRlbGV0aW9uIjoxNzk1ODI0MDAwfQ.szr5ho1fLOiQu-BmogK7lCaDqQfZHJddFO7kJxdwrmQ",
    organization: "https://github.com/orgs/hackathon-blue-tuna-19",
    lab1: "https://github.com/hackathon-blue-tuna-19/tail-spin-toys",
    altLab1: "https://github.com/Sandbox-AppOrg/tailspin1",
    lab2:
      "https://github.com/hackathon-blue-tuna-19/Build-your-automation-Lab2",
    altLab2: "https://github.com/octodemo/virtual-universe-26",
    portal:
      "https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/",
  });
});
