const path = require('path');
const { pathToFileURL } = require('url');

const DEMO_PROFILE_IDS = Object.freeze({
  Bride: 101,
  Groom: 102,
});

const formatMockUuid = (namespace, profileId) => {
  const suffix = String(profileId).padStart(12, '0');
  return `${namespace}0000000-0000-4000-8000-${suffix}`;
};

const mockUserIdForProfileId = profileId => formatMockUuid('1', profileId);
const mockProfileIdForProfileId = profileId => formatMockUuid('2', profileId);
const mockPreferenceIdForProfileId = profileId => formatMockUuid('3', profileId);

const loadFrontendMockProfiles = async () => {
  const fixtureUrl = pathToFileURL(
    path.resolve(__dirname, '..', '..', 'src', 'data', 'mockProfiles.js'),
  ).href;
  const fixtureModule = await import(fixtureUrl);
  return fixtureModule.mockProfiles;
};

module.exports = {
  DEMO_PROFILE_IDS,
  loadFrontendMockProfiles,
  mockUserIdForProfileId,
  mockProfileIdForProfileId,
  mockPreferenceIdForProfileId,
};
