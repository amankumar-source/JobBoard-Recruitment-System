
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    icon: MapPin,
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    icon: Briefcase,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Scientist", "UI/UX Designer"],
  },
  {
    filterType: "Salary",
    icon: IndianRupee,
    array: ["0-40k", "42k-1 Lakh", "1-5 Lakh", "5-15 Lakh", "15+ Lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);


  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          Filter Jobs
        </h1>
        <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
      </div>

      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => {
          const Icon = data.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-8 last:mb-0"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {data.filterType}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 ml-2">
                {data.array.map((item, idx) => {
                  const itemId = `r${index}-${idx}`;
                  const isSelected = selectedValue === item;

                  return (
                    <motion.div
                      key={itemId}
                      whileHover={{ x: 8 }}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <RadioGroupItem
                        value={item}
                        id={itemId}
                        className="w-5 h-5 border-2"
                      />
                      <Label
                        htmlFor={itemId}
                        className={`flex-1 py-3 px-5 rounded-xl font-medium transition-all duration-300 cursor-pointer
                          ${isSelected
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700 group-hover:shadow-md"
                          }`}
                      >
                        {item}
                      </Label>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </RadioGroup>

      {/* Clear Filter Button */}
      {selectedValue && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedValue("")}
          className="w-full mt-6 py-3 bg-gray-100 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all duration-300 hover:shadow-md"
        >
          Clear Filter
        </motion.button>
      )}
    </motion.div>
  );
};

export default FilterCard;


