import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  name: string;
  id: number;
  types: any[];
  height: number;
  weight: number;
  base_experience: number;
  stats: any[];
  sprites: {
    front_default: string;
  };
}

interface PokemonState {
  list: Pokemon[];
  selectedPokemon: Pokemon | null;
  selectedPokemonDetails: PokemonDetails | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PokemonState = {
  list: [],
  selectedPokemon: null,
  selectedPokemonDetails: null,
  status: 'idle',
};

export const fetchPokemons = createAsyncThunk(
  'pokemon/fetchPokemons',
  async () => {
    const response = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    );
    return response.data.results;
  },
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    selectPokemon: (state, action: PayloadAction<Pokemon>) => {
      state.selectedPokemon = action.payload;
      state.selectedPokemonDetails = null; // Reset details when selecting a new Pokémon
    },
    setSelectedPokemonDetails: (
      state,
      action: PayloadAction<PokemonDetails>,
    ) => {
      state.selectedPokemonDetails = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPokemons.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchPokemons.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = 'succeeded';
          state.list = action.payload;
        },
      )
      .addCase(fetchPokemons.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const {selectPokemon, setSelectedPokemonDetails} = pokemonSlice.actions;
export default pokemonSlice.reducer;
