import { Community } from 'shared/types/community';

export const mockCommunity1: Community = {
  id: 'crypto',
  name: 'Cryptocurrency',
  iconImage: {
    regular: 'https://crypto.jobs/storage/company-logos/s2fWpVuLctSJDfcsXwb0kN3JI0G3qpluoQQfV6kh.png',
    active: 'https://crypto.jobs/storage/company-logos/s2fWpVuLctSJDfcsXwb0kN3JI0G3qpluoQQfV6kh.png',
  },
// tslint:disable-next-line: max-line-length
  heroImage: 'https://www.revenuegy.org/wp-content/uploads/2018/06/cryptocurrency.jpg',
};

export const mockCommunity2: Community = {
  id: 'random',
  name: 'Random',
  iconImage: {
    regular: 'https://crypto.jobs/storage/company-logos/s2fWpVuLctSJDfcsXwb0kN3JI0G3qpluoQQfV6kh.png',
    active: 'https://crypto.jobs/storage/company-logos/s2fWpVuLctSJDfcsXwb0kN3JI0G3qpluoQQfV6kh.png',
  },
// tslint:disable-next-line: max-line-length
  heroImage: 'https://assets.rebelmouse.io/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8xOTI4NTg1My85ODB4LmpwZyIsImV4cGlyZXNfYXQiOjE1NTk1MzkzODZ9.7TefF2SLqC4XLzSkWDgqRb-W7uvtuHy3cCdNFusf6Uw/img.jpg',
};

export const mockCommunity3: Community = {
  id: 'product',
  name: 'Product',
  iconImage: {
    regular: 'https://crypto.jobs/storage/company-logos/s2fWpVuLctSJDfcsXwb0kN3JI0G3qpluoQQfV6kh.png',
    active: 'https://crypto.jobs/storage/company-logos/s2fWpVuLctSJDfcsXwb0kN3JI0G3qpluoQQfV6kh.png',
  },
// tslint:disable-next-line: max-line-length
  heroImage: 'https://assets.rebelmouse.io/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8xOTI4NTg1My85ODB4LmpwZyIsImV4cGlyZXNfYXQiOjE1NTk1MzkzODZ9.7TefF2SLqC4XLzSkWDgqRb-W7uvtuHy3cCdNFusf6Uw/img.jpg',
};

export const mockCommunities: Community[] = [ mockCommunity1, mockCommunity2, mockCommunity3 ];
