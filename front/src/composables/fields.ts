export function useCustomField() {
  //Prototype
  const customFieldList = (
    errorModel: object,
    dataModel: object
  ): Array<object> => [
    {
      id: "name",
      type: "input",
      label: "Name*",
      error: errorModel,
      model: dataModel,
      placeholder: "e.g. Muhammad Surga Savero"
    },
    {
      id: "email",
      type: "input",
      label: "Email*",
      error: errorModel,
      model: dataModel,
      placeholder: "e.g. mm@gmail.com"
    },
    {
      id: "address",
      type: "input",
      label: "Name*",
      error: errorModel,
      model: dataModel,
      placeholder: "e.g. Apartment 47"
    },
    {
      id: "job",
      type: "select",
      label: "Job*",
      error: errorModel,
      model: dataModel,
      placeholder: "-Select a job-",
      options: [""]
    },
    {
      id: "note",
      type: "textarea",
      label: "Note*",
      error: errorModel,
      model: dataModel,
      placeholder: "test"
    }
  ];

  return {
    customFieldList
  };
}
