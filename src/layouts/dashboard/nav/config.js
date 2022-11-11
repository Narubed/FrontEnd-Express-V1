// component.
import { Icon } from '@iconify/react';

import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/app',
    icon: <Icon icon="logos:google-analytics" width="26px" />,
  },
  {
    title: 'partners',
    path: '/partners',
    icon: <Icon icon="flat-color-icons:voice-presentation" width="26px" />,
  },
  {
    title: 'IP Address',
    path: '/ip-address',
    icon: <Icon icon="fluent-emoji:input-numbers" width="26px" />,
  },
  {
    title: 'COD Express',
    path: '/cod-express',
    icon: <Icon icon="emojione-v1:money-with-wings" width="26px" />,
  },

  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
