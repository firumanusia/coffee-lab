import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  SearchInput,
  DateField,
  FunctionField,
  useRecordContext,
  required,
} from 'react-admin'
import { Box, Typography } from '@mui/material'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import { lightTheme, darkTheme } from './theme'
import { LoginPage } from './LoginPage'
import { LayoutShell } from './layout'
import { Dashboard } from './Dashboard'
import { ResourceIcons } from './icons'

const search = [<SearchInput key="q" source="q" alwaysOn />]

// JSON <-> text helpers for recipe pours/description
const jsonFormat = (v: unknown) => (v == null ? '' : JSON.stringify(v, null, 2))
const jsonParse = (v: string) => {
  try {
    return v ? JSON.parse(v) : null
  } catch {
    return v
  }
}
const csvFormat = (v: string[] | undefined) => (Array.isArray(v) ? v.join(', ') : (v ?? ''))
const csvParse = (v: string) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])

const IdInput = () => <TextInput source="id" validate={required()} helperText="unique slug, e.g. hario-v60-01" />

/* ---------------- Waters ---------------- */
const WaterList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" /><NumberField source="ph" /><TextField source="phLabel" /><NumberField source="ppm" />
    </Datagrid>
  </List>
)
const WaterForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <TextInput source="name" validate={required()} />
    <NumberInput source="ph" validate={required()} />
    <TextInput source="phLabel" validate={required()} />
    <NumberInput source="ppm" validate={required()} />
  </SimpleForm>
)

/* ---------------- Beans ---------------- */
const BeanList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="variety" /><TextField source="origin" label="Country" /><TextField source="region" />
      <TextField source="category" /><TextField source="cupPotential" />
    </Datagrid>
  </List>
)
const BeanForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <TextInput source="variety" validate={required()} helperText="Varietas / Klon" />
    <TextInput source="origin" validate={required()} label="Country (Negara)" />
    <TextInput source="region" validate={required()} label="Region (Daerah/Origin)" />
    <TextInput source="species" defaultValue="Arabica" />
    <TextInput source="category" helperText="Kategori" />
    <TextInput source="cupPotential" helperText="Cup potential, e.g. 85-90+" />
    <TextInput source="body" /><TextInput source="acidity" /><TextInput source="sweetness" />
    <TextInput source="notes" fullWidth multiline helperText="Tasting notes" />
  </SimpleForm>
)

/* ---------------- Grinders ---------------- */
const grinderFilters = [
  <SearchInput key="q" source="q" alwaysOn />,
  <SelectInput key="active" source="active" alwaysOn choices={[{ id: true, name: 'Active' }, { id: false, name: 'Inactive' }]} />,
]
const GrinderList = () => (
  <List filters={grinderFilters} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="brand" /><TextField source="model" /><NumberField source="minMicron" />
      <NumberField source="maxMicron" /><NumberField source="umPerStep" /><BooleanField source="stepless" />
      <BooleanField source="active" />
    </Datagrid>
  </List>
)
const GrinderForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <BooleanInput source="active" defaultValue={true} helperText="Off = hidden on the public site" />
    <TextInput source="brand" validate={required()} /><TextInput source="model" validate={required()} />
    <NumberInput source="minMicron" defaultValue={0} /><NumberInput source="maxMicron" defaultValue={1200} />
    <NumberInput source="umPerStep" /><TextInput source="stepType" /><TextInput source="totalSteps" />
    <BooleanInput source="stepless" /><TextInput source="note" fullWidth multiline />
  </SimpleForm>
)

/* ---------------- Drippers ---------------- */
const geometries = ['conical', 'flat', 'trapezoid', 'hybrid', 'other'].map((id) => ({ id, name: id }))
const DripperList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="brand" /><TextField source="model" /><TextField source="geometry" />
      <NumberField source="flowFactor" /><BooleanField source="immersion" />
    </Datagrid>
  </List>
)
const DripperForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <TextInput source="brand" validate={required()} /><TextInput source="model" validate={required()} />
    <TextInput source="typeRaw" /><SelectInput source="geometry" choices={geometries} defaultValue="conical" />
    <NumberInput source="flowFactor" defaultValue={1} step={0.01} /><BooleanInput source="immersion" />
  </SimpleForm>
)

/* ---------------- Filters ---------------- */
const FilterList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="brand" /><TextField source="model" /><TextField source="material" />
      <TextField source="flowRate" /><NumberField source="flowFactor" />
    </Datagrid>
  </List>
)
const FilterForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <TextInput source="brand" validate={required()} /><TextInput source="model" validate={required()} />
    <TextInput source="material" /><TextInput source="flowRate" /><NumberInput source="flowFactor" defaultValue={1} step={0.01} />
    <TextInput source="body" /><TextInput source="clarity" /><TextInput source="sweetness" /><TextInput source="acidity" />
  </SimpleForm>
)

/* ---------------- Recipes ---------------- */
const RecipeList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" /><TextField source="author" /><NumberField source="dose" />
      <NumberField source="ratio" /><NumberField source="tempC" /><BooleanField source="fixed" />
    </Datagrid>
  </List>
)
const RecipeForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <TextInput source="name" validate={required()} /><TextInput source="author" />
    <NumberInput source="dose" defaultValue={18} /><NumberInput source="ratio" defaultValue={16} step={0.1} />
    <NumberInput source="tempC" defaultValue={93} /><NumberInput source="agtron" defaultValue={70} />
    <BooleanInput source="fixed" />
    <TextInput source="pours" format={jsonFormat} parse={jsonParse} fullWidth multiline helperText='JSON array: [{"at":0,"frac":0.2,"style":"bloom"}]' />
    <TextInput source="description" format={jsonFormat} parse={jsonParse} fullWidth multiline helperText='JSON: {"id":"...","en":"..."}' />
  </SimpleForm>
)

/* ---------------- Processes ---------------- */
const ProcessList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" /><TextField source="flavor" />
    </Datagrid>
  </List>
)
const ProcessForm = ({ create }: { create?: boolean }) => (
  <SimpleForm>
    {create && <IdInput />}
    <TextInput source="name" validate={required()} helperText="Proses pasca panen" />
    <TextInput source="description" fullWidth multiline helperText="Deskripsi singkat / cara kerja" />
    <TextInput source="flavor" fullWidth multiline helperText="Dampak pada profil rasa" />
  </SimpleForm>
)

/* ---------------- Feedback ---------------- */
const FeedbackPanel = () => {
  const r = useRecordContext()
  if (!r) return null
  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>{r.message as string}</Typography>
      <Typography variant="caption" color="text.secondary">
        {r.email ? `From: ${r.email} · ` : ''}
        {r.page ? `Page: ${r.page}` : ''}
      </Typography>
    </Box>
  )
}
const FeedbackList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
    <Datagrid expand={<FeedbackPanel />} rowClick="expand">
      <TextField source="type" />
      <FunctionField label="Message" render={(r: any) => (r.message?.length > 70 ? `${r.message.slice(0, 70)}…` : r.message)} />
      <TextField source="email" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
)

/* ---------------- Users ---------------- */
const roles = [{ id: 'USER', name: 'USER' }, { id: 'ADMIN', name: 'ADMIN' }]
const UserList = () => (
  <List filters={search} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="email" /><TextField source="name" /><TextField source="role" />
    </Datagrid>
  </List>
)
const UserEditForm = () => (
  <SimpleForm>
    <TextField source="email" />
    <TextInput source="name" />
    <SelectInput source="role" choices={roles} />
  </SimpleForm>
)

export default function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={LayoutShell}
      dashboard={Dashboard}
      theme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      title="MENOOWEL Admin"
      requireAuth
    >
      <Resource name="waters" icon={ResourceIcons.waters} list={WaterList} edit={() => <Edit><WaterForm /></Edit>} create={() => <Create><WaterForm create /></Create>} />
      <Resource name="beans" icon={ResourceIcons.beans} list={BeanList} edit={() => <Edit><BeanForm /></Edit>} create={() => <Create><BeanForm create /></Create>} />
      <Resource name="grinders" icon={ResourceIcons.grinders} list={GrinderList} edit={() => <Edit><GrinderForm /></Edit>} create={() => <Create><GrinderForm create /></Create>} />
      <Resource name="drippers" icon={ResourceIcons.drippers} list={DripperList} edit={() => <Edit><DripperForm /></Edit>} create={() => <Create><DripperForm create /></Create>} />
      <Resource name="filters" icon={ResourceIcons.filters} list={FilterList} edit={() => <Edit><FilterForm /></Edit>} create={() => <Create><FilterForm create /></Create>} />
      <Resource name="recipes" icon={ResourceIcons.recipes} list={RecipeList} edit={() => <Edit><RecipeForm /></Edit>} create={() => <Create><RecipeForm create /></Create>} />
      <Resource name="processes" icon={ResourceIcons.processes} list={ProcessList} edit={() => <Edit><ProcessForm /></Edit>} create={() => <Create><ProcessForm create /></Create>} />
      <Resource name="users" icon={ResourceIcons.users} list={UserList} edit={() => <Edit><UserEditForm /></Edit>} />
      <Resource name="feedback" icon={ResourceIcons.feedback} list={FeedbackList} />
    </Admin>
  )
}
