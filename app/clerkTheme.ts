
export const clerkThemes = {
  baseTheme: {
    variables: {
      colorBackground: "#19191A",
      colorInputBackground: "#19191A",
      colorAlphaShade: "white",
      colorText: "white",
      colorInputText: "white",
    },
    __type: "prebuilt_appearance",
  },
  layout: {
    socialButtonsVariant: "iconButton",
  },
  variables: {
    colorPrimary: "#FFFFFF",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  },
  elements: {
    card: {
      background: "linear-gradient(180deg, #39269B 0%, #342480 100%)",
    },
    logoImage: {
      filter: "brightness(0) invert(1)",
    },
    headerTitle: {
      fontSize: "28px",
    },
    headerSubtitle: {
      color: "#FFFFFF",
    },
    main: {
      gap: "2rem",
    },
    socialButtonsProviderIcon__github: {
      filter: "brightness(0) invert(1)",
    },
    dividerBox: {
      display: "none",
    },
    formFieldInput: {
      backgroundColor: "transparent",
    },
    formButtonPrimary: {
      backgroundColor: "#FFFFFF30",
      fontSize: "12px",
      textTransform: "none",
      "&:focus": {
        backgroundColor: "#FFFFFF15",
      },
      "&:active": {
        backgroundColor: "#FFFFFF15",
      },
      "&:hover": {
        backgroundColor: "#FFFFFF15",
      },
    },
    footer: {
      "& + div": {
        backgroundColor: "#130162",
      },
    },
  },
};

export const clerkDarkTheme = {
  variables: {
    colorBackground: "#19191A",
    colorInputBackground: "#19191A",
    colorAlphaShade: "white",
    colorText: "white",
    colorInputText: "white",
  },
  elements: {
    logoImage: {
      filter: "brightness(0) invert(1)",
    },
    socialButtonsProviderIcon__github: {
      filter: "brightness(0) invert(1)",
    },
    footer: {
      "& + div": {
        background: "rgb(49, 49, 51)",
      },
    },
  },
};

export const clerkLightTheme = { variables: {}, elements: {} };



