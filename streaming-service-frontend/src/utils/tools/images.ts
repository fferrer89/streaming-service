const getImageUrl = (id: string) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_EXPRESS_URL}/file/download/${id}`;
};

export { getImageUrl };
