type EditSessionHandlers = {
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

let active: EditSessionHandlers | null = null;
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeEditSession(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getEditSessionVersion() {
  return version;
}

export function notifyEditSessionChanged() {
  emit();
}

export function registerEditSessionHandlers(handlers: EditSessionHandlers) {
  active = handlers;
  emit();
  return () => {
    if (active === handlers) {
      active = null;
      emit();
    }
  };
}

export function runListUndo(storeUndo: () => void) {
  if (active?.undo()) {
    emit();
    return;
  }
  storeUndo();
}

export function runListRedo(storeRedo: () => void) {
  if (active?.redo()) {
    emit();
    return;
  }
  storeRedo();
}

export function editSessionCanUndo() {
  return active?.canUndo() ?? false;
}

export function editSessionCanRedo() {
  return active?.canRedo() ?? false;
}
