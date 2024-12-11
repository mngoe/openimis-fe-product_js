export const RIGHT_PRODUCT = 121000;
export const RIGHT_PRODUCT_DELETE = 121004;
export const RIGHT_PRODUCT_ADD = 121002;
export const RIGHT_PRODUCT_UPDATE = 121003;
export const RIGHT_PRODUCT_DUPLICATE = 121005;
export const EMPTY_STRING = '';
export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const PRODUCT_QUANTITY_LIMIT = 15;

export const PRICE_ORIGINS = { P: "PRICELIST", O: "PROVIDER", R: "RELATIVE" };
export const LIMIT_TYPES = { F: "FIXED_AMOUNT", C: "CO_INSURANCE" };

export const HEALTH_FACILITY_TYPE = "HEALTH_FACILITY_TYPE";
export const CLAIM_TYPE = "CLAIM_TYPE";

export const CEILING_DISCRIMINATION = [HEALTH_FACILITY_TYPE, CLAIM_TYPE];
export const CEILING_EXCLUSIONS = ["HOSPITAL", "NON_HOSPITAL", "BOTH"];
export const CEILING_TYPES = ["INSUREE", "TREATMENT", "POLICY"];

export const LIMIT_ADULT = "limitAdult";
export const LIMIT_ADULT_R = "limitAdultR";
export const LIMIT_ADULT_E = "limitAdultE";

export const LIMIT_CHILD = "limitChild";
export const LIMIT_CHILD_R = "limitChildR";
export const LIMIT_CHILD_E = "limitChildE";

export const LIMIT_COLUMNS = [LIMIT_ADULT, LIMIT_ADULT_R, LIMIT_ADULT_E, LIMIT_CHILD, LIMIT_CHILD_R, LIMIT_CHILD_E];
