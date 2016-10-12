var request = require('request');
var fs = require("fs");
var dir = './avatars';

// Makes an un-authenticated request to github
function githubRequest(endpoint, cb) {
    var githubRoot = "https://api.github.com";

    // Github requests require a user agent
    var options = {
        url: `${githubRoot}${endpoint}`,
        headers: {
            'User-Agent': 'require',
        }
    };

    //Passes callback down to request
    request.get(options, cb);
}

// Here we're using getRepoContributors to get api repo URL
function getRepoContributors(repoOwner, repoName, cb) {
    //Passing callback function down
    githubRequest(`/repos/${repoOwner}/${repoName}/contributors`, cb);
}

var repoOwner = process.argv[2]; // Get username from CL
var repoName = process.argv[3]; // Get username from CL

console.log(`Getting ${repoOwner} ${repoName} contributors...\n`);

getRepoContributors(repoOwner, repoName, function(error, response, body) {
    if (error) {
        //Return error message
        console.log("Something went wrong:", error);
        return;
    }

    //parse body content
    var contributors = JSON.parse(body);

    console.log(`${contributors.length} contributors:\n`);

    //loop through contributor list, send avatar_url and contributor.login to downloadAvatar
    contributors.forEach(function(contributor) {
        downloadAvatar(contributor.avatar_url, contributor.login);
    });
});

function downloadAvatar(avatarUrl, name) {
   //is avatars/ directory does not exist, mkdir
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    //gets contributor.avatar_url, writes to /avatars directory using contributor.login, save as .png
    request.get(avatarUrl).pipe(fs.createWriteStream('avatars/' + name + '.png'));
}
