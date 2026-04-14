# Code Examples

Common UI patterns. For app-specific imports and component names, see `docs/<AppName>/design/`.

## Standard Page Layout

```tsx
export function GamesPage() {
  return (
    <AppLayout>
      <PageLayout>
        <PageLayout.Header>
          <PageLayout.Title>Games</PageLayout.Title>
          <Spacer />
          <Button onClick={handleCreate}>
            <Plus /> Add Game
          </Button>
        </PageLayout.Header>

        <PageLayout.Content>
          <GamesTable games={games} onEdit={handleEdit} onDelete={handleDelete} />
        </PageLayout.Content>
      </PageLayout>
    </AppLayout>
  );
}
```

## Resource Drawer (Create/Edit)

```tsx
function GameDrawer({ open, onClose, game }: GameDrawerProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: game,
  });

  return (
    <Drawer open={open} onClose={onClose} placement="end" size="lg">
      <Drawer.Header>
        <Drawer.Title>{game ? "Edit Game" : "Add Game"}</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <VStack gap={4}>
          <Field label="Date" error={errors.scheduledAt?.message} required>
            <Input type="datetime-local" {...register("scheduledAt")} borderRadius="lg" />
          </Field>
          <Field label="Fee (€)" error={errors.fee?.message} required>
            <Input type="number" {...register("fee", { valueAsNumber: true })} borderRadius="lg" />
          </Field>
        </VStack>
      </Drawer.Body>

      <Drawer.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </Drawer.Footer>
    </Drawer>
  );
}
```

## Confirmation Dialog (Delete)

```tsx
function DeleteGameDialog({ game, onConfirm, onClose }: DeleteGameDialogProps) {
  return (
    <Dialog open onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>Delete game?</Dialog.Title>
      </Dialog.Header>

      <Dialog.Body>
        This will permanently delete the game on {formatDate(game.scheduledAt)}.
        This action cannot be undone.
      </Dialog.Body>

      <Dialog.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button colorScheme="red" onClick={() => { onConfirm(game.id); onClose(); }}>
          Delete
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
```

## Multi-Step Drawer Navigation

For flows that require multiple steps (e.g. select league → add game):

```tsx
// Step 1: Entry point — set callbacks, open first drawer
function GamesSection() {
  const { openDrawer, setFlowCallbacks } = useDrawer();

  const handleAddGame = () => {
    setFlowCallbacks("gameForm", {
      onSave: (game) => refetch(),
    });
    openDrawer("leagueSelector");
  };

  return <Button onClick={handleAddGame}><Plus /> Add Game</Button>;
}

// Step 2: League selector — navigates forward
function LeagueSelectorDrawer() {
  const { openDrawer, closeDrawer, canGoBack, goBack } = useDrawer();

  return (
    <Drawer open onClose={closeDrawer}>
      <Drawer.Header>
        {canGoBack && <Button variant="ghost" onClick={goBack}><ArrowLeft /></Button>}
        <Drawer.Title>Select League</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        {leagues.map(league => (
          <Button key={league.id} onClick={() => openDrawer("gameForm", { leagueId: league.id })}>
            {league.name}
          </Button>
        ))}
      </Drawer.Body>
    </Drawer>
  );
}

// Step 3: Game form — retrieves callbacks
function GameFormDrawer({ leagueId }: { leagueId: string }) {
  const { closeDrawer, canGoBack, goBack, getFlowCallbacks } = useDrawer();
  const callbacks = getFlowCallbacks("gameForm");

  const onSave = async (values: GameFormValues) => {
    await createGame({ ...values, leagueId });
    callbacks?.onSave?.();
    closeDrawer();
  };

  return (
    <Drawer open onClose={closeDrawer}>
      <Drawer.Header>
        {canGoBack && <Button variant="ghost" onClick={goBack}><ArrowLeft /></Button>}
        <Drawer.Title>Add Game</Drawer.Title>
      </Drawer.Header>
      {/* ... form body */}
    </Drawer>
  );
}
```

## Translucent Container

For custom overlay-like containers (built-in overlay components already apply this):

```tsx
<Box
  background="rgba(255, 255, 255, 0.75)"
  backdropFilter="blur(8px)"
  borderRadius="lg"
  border="1px solid"
  borderColor="gray.200"
  padding={4}
>
  {children}
</Box>
```

## Action Menu (Row Actions)

```tsx
<Menu>
  <Menu.Trigger>
    <Button variant="ghost" size="sm"><MoreVertical size={16} /></Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={() => handleEdit(item)}>
      <Pencil size={14} /> Edit
    </Menu.Item>
    <Menu.Item onClick={() => handleDelete(item)} color="red">
      <Trash2 size={14} /> Delete
    </Menu.Item>
  </Menu.Content>
</Menu>
```

## Empty State

```tsx
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <VStack gap={3} py={12} color="gray.500">
      <CalendarOff size={32} />
      <Text fontWeight="medium">No games yet</Text>
      <Text fontSize="sm">Add the first game to get started.</Text>
      <Button size="sm" onClick={onAdd}><Plus /> Add Game</Button>
    </VStack>
  );
}
```
