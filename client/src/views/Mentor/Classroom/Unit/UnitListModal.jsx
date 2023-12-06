import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import {deleteUnit} from '../../../../Utils/requests';

const UnitListModal = ({ visible, onCancel, units, onUnitSelect, selectedUnits }) => {

  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedUnitToDelete, setSelectedUnitToDelete] = useState(null);
  const [localSelectedUnits, setLocalSelectedUnits] = useState(selectedUnits || []);

  useEffect(() => {
    setLocalSelectedUnits(selectedUnits || []);
  }, [selectedUnits]);

  const handleUnitSelect = (unit) => {
    const isSelected = localSelectedUnits.includes(unit);
    const updatedSelected = isSelected
      ? localSelectedUnits.filter((selectedUnit) => selectedUnit !== unit)
      : [...localSelectedUnits, unit];

    setLocalSelectedUnits(updatedSelected); // Update local state
    onUnitSelect && onUnitSelect(updatedSelected); // Notify parent component about the selected units
  };

  const showConfirmation = (unit) => {
    setSelectedUnitToDelete(unit);
    setConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmationVisible(false);
    if (selectedUnitToDelete) {
      const updatedSelectedUnits = localSelectedUnits.filter(unit => unit !== selectedUnitToDelete);
      const res = await deleteUnit(selectedUnitToDelete.id);
      if(res){
        message.success(`'${selectedUnitToDelete.name}' has been deleted`)
      }
      setLocalSelectedUnits(updatedSelectedUnits);
      onUnitSelect && onUnitSelect(updatedSelectedUnits); // Notify parent component about the selected units
    }
  };

  const handleCancelDelete = () => {
    setSelectedUnitToDelete(null);
    setConfirmationVisible(false);
  };

  return (
    <Modal
      title="Select Unit to Remove"
      visible={visible}
      onCancel={onCancel}
      footer={[]}
    >
      <ul className='all-units'>
        {units.map((unit) => (
          <li key={unit.id}>
            <button className='unit-selection' onClick={() => showConfirmation(unit)}>
              {unit.name}
            </button>
          </li>
        ))}
      </ul>
      <Modal
        title="Confirm Delete"
        visible={isConfirmationVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Confirm"
      >
        <p>Are you sure you want to delete this unit?</p>
      </Modal>
    </Modal>
  );
};

export default UnitListModal;
