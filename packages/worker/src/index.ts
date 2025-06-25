import editor from './editor';

const worker = async () => {
  await Promise.all([editor()]);
};

worker();
