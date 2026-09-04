function searchText(repo) {
  return [
    repo.name,
    repo.owner,
    repo.description,
    repo.editorialSummary,
    repo.language,
    repo.categoryLabel,
    repo.resourceType,
    repo.note,
    repo.takeaway,
    repo.contentMarkdown,
    ...(repo.topics || []),
    ...(repo.tags || []),
  ].join(" ").toLocaleLowerCase("zh-CN");
}

function compareDateDescending(field, left, right) {
  return new Date(right[field]).getTime() - new Date(left[field]).getTime();
}

export function filterRepositories(repositories, route) {
  const needle = route.q.trim().toLocaleLowerCase("zh-CN");
  return repositories.filter((repo) => {
    const sourceMatch = route.source === "all" || repo.sourceStatus === route.source;
    const archiveMatch = route.archive === "all"
      || (route.archive === "active" && !repo.personalArchived)
      || (route.archive === "github" && repo.archived)
      || (route.archive === "personal" && repo.personalArchived);
    return sourceMatch
      && archiveMatch
      && (route.category === "all" || repo.category === route.category)
      && (route.stage === "all" || repo.stage === route.stage)
      && (route.type === "all" || repo.resourceTypeId === route.type)
      && (route.language === "all" || repo.language === route.language)
      && (route.tag === "all" || repo.tags.includes(route.tag))
      && (!needle || searchText(repo).includes(needle));
  }).sort((left, right) => {
    let result = 0;
    if (route.sort === "stars") result = right.stars - left.stars;
    else if (route.sort === "updated") result = compareDateDescending("pushedAt", left, right);
    else result = compareDateDescending("starredAt", left, right);
    return result || left.repoId - right.repoId;
  });
}
