// fetchRepoData.js
import fetch from 'node-fetch';

export async function fetchRepoData(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');

  const [, owner, repo] = match;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

  const repoRes = await fetch(apiBase);
  if (!repoRes.ok) {
    throw new Error(`Failed to fetch repository: ${repoRes.statusText}`);
  }

  const repoData = await repoRes.json();
  const created = new Date(repoData.created_at);
  const now = new Date();
  const lastUpdate = new Date(repoData.updated_at);
  const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  const projectAge = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 365));

  let activityLevel = 'inactive';
  if (daysSinceUpdate < 7) activityLevel = 'highly active';
  else if (daysSinceUpdate < 30) activityLevel = 'active';
  else if (daysSinceUpdate < 90) activityLevel = 'moderately active';
  else if (daysSinceUpdate < 180) activityLevel = 'periodically maintained';

  const summary = [
    repoData.description,
    `This ${projectAge > 0 ? `${projectAge}-year-old ` : ''}project has garnered ${repoData.stargazers_count.toLocaleString()} stars and ${repoData.forks_count.toLocaleString()} forks`,
    `It is a ${activityLevel} project with ${repoData.open_issues_count} open issues${repoData.open_issues_count > 0 ? ' available for contribution' : ''}`,
    `Maintained by ${repoData.owner.login} under ${repoData.license ? repoData.license.name : 'no specified license'}`
  ].filter(Boolean).join('. ') + '.';

  return {
    name: repoData.name,
    description: repoData.description || 'No description provided.',
    summary,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    lastUpdated: new Date(repoData.updated_at).toLocaleDateString(),
    repoUrl: repoData.html_url
  };
}
