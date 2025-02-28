import profileData from '../public/content/profileData.json';

const Tabs = [
  "Projects",
  "Side Projects",
  "Exhibitions",
  "Speaking",
  "Writing",
  "Awards",
  "Features",
  "Work Experience",
  "Volunteering",
  "Education",
  "Certifications",
  "Contact",
];

function profileSectionToJSONField(section) {
  switch (section) {
    case "Projects":
      return "projects";
    case "Side Projects":
      return "sideProjects";
    case "Exhibitions":
      return "exhibitions";
    case "Speaking":
      return "talks";
    case "Writing":
      return "writing";
    case "Awards":
      return "awards";
    case "Features":
      return "features";
    case "Work Experience":
      return "workExperience";
    case "Volunteering":
      return "volunteering";
    case "Education":
      return "education";
    case "Certifications":
      return "certifications";
    case "Contact":
      return "contact";
  }
  return undefined;
}

class CVMediaObject {
  constructor(props) {
    this.url = props.url;
    this.width = props.width;
    this.height = props.height;
  }

  toString() { return this.url; }
}

const mediaFiles = {
  "P9052732.png": {
    "url": "/mediaManager/P9052732.png",
    "width": 4032,
    "height": 3024
  },
  "P9052762.png": {
    "url": "/mediaManager/P9052762.png",
    "width": 3024,
    "height": 4032
  },
  "P9052768_preedit.png": {
    "url": "/mediaManager/P9052768_preedit.png",
    "width": 3024,
    "height": 4032
  },
  "PA032791.png": {
    "url": "/mediaManager/PA032791.png",
    "width": 3939,
    "height": 2954
  }
};
mediaFiles[''] = { url: '' };

const cv = {
  ...profileData,
  get allCollections() {
    const ret = [];
    const sections = profileData.general.sectionOrder || Tabs;
    for (const section of sections) {
      const jsonField = profileSectionToJSONField(section);
      if (typeof jsonField == "undefined") {
        continue;
      }
      const fieldValue = profileData[jsonField];
      if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
        continue;
      }
      ret.push({
        name: section,
        items: fieldValue,
      });
    }
    return ret;
  },
  media: (filename) => {
    return new CVMediaObject(mediaFiles[filename] || mediaFiles['']);
  },
};

export default cv;
