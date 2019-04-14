export namespace dto {
  export type Messages = {
    errors?: string[];
    warnings?: string[];
    infos?: string[];
  };

  export type User = {
    pid: string;
    dn: string;
    roles: string[];
  };

  export type Header = {
    image: string;
    extention: string;
    htmlcontent?: any;
    headerheightpercentage: number;
  };

  export type Menuitem = {
    id: string;
    caption: string;
    content: string;
    deeplinkurl?: any;
    deeplinktype: number;
  };

  export type BrandInfo = {
    header: Header;
    footer?: any;
    menuitems: Menuitem[];
    cul: string;
  };

  export type SignInResponse = {
    ut?: string;
    us?: User;
    bi?: BrandInfo;
    ms?: Messages;
    isValid?: boolean;
  };
}
