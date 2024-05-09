import { deleteAlbum } from "../../../app/actions";

export default function MenuControls({
  albumData,
  setShowAddFormDialog,
  setShowEditFormDialog,
  currentArticleId,
  setCurrentArticleId,
  objectId,
  refetch,
}) {
  return (
    <menu className="controls-menu">
      <li>
        <button
          onClick={(event) => {
            setCurrentArticleId(objectId); // Store article ID
            setShowEditFormDialog(true);
            setShowAddFormDialog(false);
          }}
        >
          Edit
        </button>
      </li>
      <li>
        <button
          type="submit"
          value="submit"
          id="delete"
          name="delete"
          onClick={async () => {
            setCurrentArticleId(objectId); // Store article ID
            let data = await deleteAlbum(albumData?.albumId);
            // console.log(data?.album?._id)
            // console.log(data?.errorMessages?.[0])
            setCurrentArticleId(objectId); // Store article ID
            refetch();
          }}
        >
          Delete
        </button>
      </li>
    </menu>
  );
}
