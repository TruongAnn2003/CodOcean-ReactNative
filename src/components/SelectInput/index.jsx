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
    <View className="my-2 px-4">
      <Text className="text-base mb-2">Select an option:</Text>
      <View className="bg-gray-200 rounded-md">
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          className="h-12 bg-gray-200 rounded-md"
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
    </View>
  );
}

export default SelectInput;
