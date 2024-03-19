import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getlandordProperties = createAsyncThunk(
  "landlordProperty/getlandordProperties",
  async (access_token) => {
    console.log(access_token)
    const response = await fetch("https://reileadsapi.exerboost.in/upkeep/app/landlord/fetch/all-property", {
      headers: {
        Authorization: ` ${access_token}` 
      }
    });
    const data = await response.json();
    console.log(data.result,"landlorddata")
    // Filter properties based on landlordId
    // const properties = data.result.filter(property => property.landlordId === landlordId);
    // console.log(landlordProperty,"landlordproperty");
    return data.result;
  }
);


export const deleteProperty = createAsyncThunk(
  "landlordProperty/deleteProperty",
  async ({ access_token, propertyId }) => {
    const response = await fetch(`https://reileadsapi.exerboost.in/upkeep/app/landlord/delete/property/${propertyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `${access_token}`
      }
    });
    const data = await response.json();
    return data; 
  }
);


export const createProperty = createAsyncThunk(
  "landlordProperty/createProperty",
  async ({ access_token, propertyData }) => {
    // console.log(propertyData)

    const formData = new FormData();

    // Append form data fields to the FormData object
    Object.keys(propertyData).forEach(key => {
      formData.append(key, propertyData[key]);
    });

    const response = await fetch("https://reileadsapi.exerboost.in/upkeep/app/landlord/create/property", {
      method: 'POST',
      headers: {
        Authorization: ` ${access_token}`
      },
      body: formData
    });
    const data = await response.json();
    return data; // You can handle the response as needed
  }
);
//update
export const updateProperty = createAsyncThunk(
  "landlordProperty/updateProperty",
  async ({ access_token, editData, updatepropertyId}) => {
    // console.log(propertyData)

    const formData = new FormData();

    // Append form data fields to the FormData object
    Object.keys(editData).forEach(key => {
      formData.append(key, editData[key]);
    });
    const response = await fetch(`https://reileadsapi.exerboost.in/upkeep/app/landlord/update/property/${updatepropertyId}`, {
      method: 'PATCH',
      headers: {
        Authorization: ` ${access_token}`
      },
      body: formData
    });
    const data = await response.json();
    return data; // You can handle the response as needed
    //comment
  }
);

const landlordHomeSlice = createSlice({
  name: "landlord",
  initialState: {
    landlordProperty: [],
    loading: false, 
  },
  extraReducers: {
    [getlandordProperties.pending]: (state) => {
      state.loading = true;
    },
    [getlandordProperties.fulfilled]: (state, action) => {
      state.loading = false;
      state.landlordProperty = action.payload;
    },
    [getlandordProperties.rejected]: (state) => {
      state.loading = false;
    },
    [deleteProperty.pending]: (state) => {
      state.loading = true;
    },
    [deleteProperty.fulfilled]: (state, action) => {
      state.loading = false;
      // Remove the deleted property from the state
    },
    [deleteProperty.rejected]: (state) => {
      state.loading = false;
    },

    [createProperty.pending]: (state) => {
      state.loading = true;
    },
    [createProperty.fulfilled]: (state, action) => {
      state.loading = false;
      // You can handle the response if needed
    },
    [createProperty.rejected]: (state) => {
      state.loading = false;
      // Handle the rejection if needed
    },
    [updateProperty.pending]: (state) => {
      state.loading = true;
    },
    [updateProperty.fulfilled]: (state, action) => {
      state.loading = false;
      // You can handle the response if needed
    },
    [updateProperty.rejected]: (state) => {
      state.loading = false;
      // Handle the rejection if needed
    },
  },
});

export default landlordHomeSlice.reducer;
