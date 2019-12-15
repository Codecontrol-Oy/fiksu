/* ROUTES */
export const ROUTE_HOMEPAGE = "/"
export const ROUTE_REGISTER = "/register"
export const ROUTE_ACCOUNT = "/account"
export const ROUTE_ACCOUNT_PROFILE = "/account/profile"
export const ROUTE_ACCOUNT_ELECTRICITY = "/account/electricity-consumption"
export const ROUTE_ACCOUNT_FAMILY = "/account/family"
export const ROUTE_ACCOUNT_ECO = "/account/eco-life"
export const ROUTE_ACCOUNT_GROUP = "/account/groups"
export const ROUTE_ACCOUNT_SETTINGS = "/account/settings"
export const ROUTE_ACCOUNT_STATISTICS = "/account/statistics"
export const ROUTE_RESET_PASSWORD = "/reset-password"
export const ROUTE_NEW_PASSWORD = "/new-password"
export const ROUTE_VERIFY_PROFILE = "/verify-profile"
export const ROUTE_GDPR = "/privacy-information"

/* PUBLICITY SETTINGS */
export const PUBLICITY_SETTINGS = [
    {
        value: "NONE",
        text: "Ei julkinen"
    },
    {
        value: "FRIENDS_ONLY",
        text: "Vain ystävät"
    },
    {
        value: "PUBLIC",
        text: "Julkinen"
    }
]