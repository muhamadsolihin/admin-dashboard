export interface Menu {
  name:         string;
  path:         string;
  icon:         string;
  icon_active:  string;
  children:     ChildMenu[];
}

export interface ChildMenu {
  name:         string;
  path:         string;
}
