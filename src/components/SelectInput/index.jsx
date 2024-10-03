import React, { useState } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker

function SelectInput({ options, onSelect }) {
  const [selectedValue, setSelectedValue] = useState(options[0]?.value || "");

  const handleValueChange = (value) => {
    setSelectedValue(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <View className="bg-white rounded-lg">
      <Picker
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
        className="bg-white rounded-lg"
        style={{
          height: 50,
          backgroundColor: "white",
          color: "#024873",
          fontSize: 16,
          borderRadius: 30,
          fontFamily: "SairaSemiCondensed-Regular",
        }}
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.name}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );
}

export default SelectInput;
