const fs = require("fs");

const PREFIX = "Suggestion:";

function parseURLFromIssueTitle(title) {
  return title.replace(PREFIX, "").trim();
}

function findExistingMatchForUrl(url, list) {
  return list.findIndex((listItem) => {
    const match = url.match(new RegExp(listItem.urlPattern));
    return match;
  });
}

fs.readFile(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, function (err, file) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  const database = JSON.parse(file.toString());
  const gh_context = JSON.parse(process.env.gh_context);
  const issueTitle = gh_context.event.issue.title;
  if (!issueTitle.startsWith(PREFIX)) {
    return;
  }
  const [suggestedUrl, name, ...descriptions] = gh_context.event.issue.body.split("\n");
  const url = parseURLFromIssueTitle(issueTitle);
  const existingIndex = findExistingMatchForUrl(url, database);
  console.log("Index for url", url, existingIndex);
  const newItem = { url: suggestedUrl.trim(), name: name.trim(), desc: descriptions.join() };
  console.log("New Item", newItem);
  if (existingIndex === -1) {
    const item = {
      urlPattern: url,
      alternatives: [newItem],
    };
    database.push(item);
  } else {
    database[existingIndex].alternatives.push(newItem);
  }
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, JSON.stringify(database, null, 4));
});
