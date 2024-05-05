export default function AddItem({itemName, setShowEditFormDialog, setShowAddFormDialog}) {
    return (
        <button className='add-element-btn'
                onClick={() => {
                    setShowEditFormDialog(false);
                    setShowAddFormDialog(true);
                }}>
            Add {itemName}
        </button>
    )
}