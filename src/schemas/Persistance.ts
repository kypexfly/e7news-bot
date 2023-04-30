import { Schema, model } from "mongoose";
import { IPersistance } from "../types";

const PersistanceSchema = new Schema<IPersistance>({
  articleIDs: { required: true, type: [String], default: [] },
  lastCovenant: { required: true, type: Number, default: 332 },
  lastMystic: { required: true, type: Number, default: 67 },
});

const PersistanceModel = model("persitance", PersistanceSchema);

export default PersistanceModel;
