import { DownOutlined } from "@ant-design/icons";
import Tooltip from "@components/Tooltip";
import { Link, Text } from "@components/Typography";
import { Dropdown, MenuProps, Space } from "antd";

import type { LinkLikeNavbarItemProps } from "@theme/NavbarItem";
import type { ComponentTypesObject } from "@theme/NavbarItem/ComponentTypes";
import DefaultNavbarItem from "@theme/NavbarItem/DefaultNavbarItem";
import DocNavbarItem from "@theme/NavbarItem/DocNavbarItem";
import DocSidebarNavbarItem from "@theme/NavbarItem/DocSidebarNavbarItem";
import DocsVersionDropdownNavbarItem from "@theme/NavbarItem/DocsVersionDropdownNavbarItem";
import DocsVersionNavbarItem from "@theme/NavbarItem/DocsVersionNavbarItem";
import { DesktopOrMobileNavBarItemProps } from "@theme/NavbarItem/DropdownNavbarItem";
import DropdownNavbarItemMobile, {
  Props
} from "@theme/NavbarItem/DropdownNavbarItem";
import HtmlNavbarItem from "@theme/NavbarItem/HtmlNavbarItem";
import LocaleDropdownNavbarItem from "@theme/NavbarItem/LocaleDropdownNavbarItem";
import SearchNavbarItem from "@theme/NavbarItem/SearchNavbarItem";

const DropdownNavbarItem = ({ mobile, ...props }: Props) => {
  return mobile ? (
    <DropdownNavbarItemMobile mobile={mobile} {...props} />
  ) : (
    <Dropdown
      trigger={["hover", "click"]}
      menu={{
        items: props.items.map(
          (item: LinkLikeNavbarItemProps & { description: string }) => {
            return {
              label: (
                <Tooltip placement="right" title={item.description}>
                  {
                    <Link
                      href={item.to}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>{item.label}</span>
                    </Link>
                  }
                </Tooltip>
              ),
              key: item.href
            };
          }
        )
      }}
      children={
        <a
          className="navbar__item navbar__link"
          style={{
            cursor: "pointer"
          }}
        >
          <Space>
            {props.label}
            <DownOutlined />
          </Space>
        </a>
      }
    />
  );
};

const ComponentTypes: ComponentTypesObject = {
  default: DefaultNavbarItem,
  localeDropdown: LocaleDropdownNavbarItem,
  search: SearchNavbarItem,
  dropdown: DropdownNavbarItem,
  html: HtmlNavbarItem,
  doc: DocNavbarItem,
  docSidebar: DocSidebarNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem
};

export default ComponentTypes;
