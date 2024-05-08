const getImageUrl = (id: string) => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${id}`;
};

export { getImageUrl };
