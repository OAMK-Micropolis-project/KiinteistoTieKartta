import { useState } from "react";
import { cardStyle, sectionTitle } from "../../styles";
import type { Kiinteisto, Toimenpide } from "../../types";
import ToimenpideModal from "../ToimenpideModal";
import { isOverdue, sortByPlannedDate } from "../../utils/kiinteistoUtils";

interface Props {
  item: Kiinteisto;
  onUpdate: (updated: Kiinteisto) => void;
}

// ── Edit form state (issue #1: consolidated from 5 separate useState calls) ──

interface EditForm {
  id: string; // stable ID of the toimenpide being edited
  otsikko: string;
  kuvaus: string;
  kustannus: string;
  suunniteltuPvm: string;
  tehtyPvm: string;
}

export default function ToimenpiteetTab({ item, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [openDescId, setOpenDescId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function startEdit(t: Toimenpide) {
    setEditForm({
      id: t.id,
      otsikko: t.otsikko,
      kuvaus: t.kuvaus ?? "",
      kustannus: String(t.kustannukset),
      suunniteltuPvm: t.suunniteltuPvm ?? "",
      tehtyPvm: t.tehtyPvm ?? "",
    });
  }

  function saveEdit() {
    if (!editForm) return;

    const updated = item.toimenpiteet.map((t) =>
      t.id === editForm.id
        ? {
            ...t,
            otsikko: editForm.otsikko,
            kuvaus: editForm.kuvaus || undefined,
            kustannukset: Number(editForm.kustannus) || 0,
            suunniteltuPvm: editForm.suunniteltuPvm || undefined,
            tehtyPvm: editForm.tehtyPvm || undefined,
          }
        : t,
    );

    onUpdate({ ...item, toimenpiteet: updated });
    setEditForm(null);
  }

  function deleteToimenpide(id: string) {
    onUpdate({
      ...item,
      toimenpiteet: item.toimenpiteet.filter((t) => t.id !== id),
    });
  }

  function handleSaveNew(t: Toimenpide) {
    onUpdate({ ...item, toimenpiteet: [...item.toimenpiteet, t] });
    setShowModal(false);
    setSaveMessage("Toimenpide tallennettu");
    setTimeout(() => setSaveMessage(null), 2000);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Add button */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Toimenpiteet</h3>
        <button
          onClick={() => {
            setModalKey((k) => k + 1);
            setShowModal(true);
          }}
        >
          Lisää toimenpide
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <ToimenpideModal
          key={modalKey}
          onClose={() => setShowModal(false)}
          onSave={handleSaveNew}
        />
      )}

      {/* List */}
      <div style={cardStyle}>
        {item.toimenpiteet.length === 0 && (
          <p>Ei kirjattuja toimenpiteitä.</p>
        )}

        {saveMessage && (
          <div style={{ color: "green", marginBottom: 12 }}>
            ✅ {saveMessage}
          </div>
        )}

        {/* Issue #8: keyed by stable t.id, not sort-order index */}
        {[...item.toimenpiteet].sort(sortByPlannedDate).map((t) => {
          const overdue = isOverdue(t);
          const isOpen = openDescId === t.id;
          const isEditing = editForm?.id === t.id;

          return (
            <div
              key={t.id}
              style={{
                marginBottom: 16,
                padding: 12,
                border: "1px solid #ddd",
                borderLeft: overdue
                  ? "6px solid #d32f2f"
                  : "6px solid transparent",
                background: overdue ? "#fff5f5" : "transparent",
              }}
            >
              {isEditing ? (
                // ── Edit mode ──
                <>
                  <input
                    value={editForm.otsikko}
                    onChange={(e) =>
                      setEditForm({ ...editForm, otsikko: e.target.value })
                    }
                  />
                  <textarea
                    value={editForm.kuvaus}
                    onChange={(e) =>
                      setEditForm({ ...editForm, kuvaus: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    value={editForm.kustannus}
                    onChange={(e) =>
                      setEditForm({ ...editForm, kustannus: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    value={editForm.suunniteltuPvm}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        suunniteltuPvm: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    value={editForm.tehtyPvm}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tehtyPvm: e.target.value })
                    }
                  />
                  <button onClick={saveEdit}>Tallenna</button>
                  <button onClick={() => setEditForm(null)}>Peruuta</button>
                </>
              ) : (
                // ── View mode ──
                <>
                  <strong>{t.otsikko}</strong>

                  {t.kuvaus && (
                    <button
                      onClick={() =>
                        setOpenDescId(isOpen ? null : t.id)
                      }
                    >
                      {isOpen ? "Piilota kuvaus" : "Näytä kuvaus"}
                    </button>
                  )}

                  <div>Kustannus: {t.kustannukset} €</div>
                  {t.suunniteltuPvm && (
                    <div>Suunniteltu: {t.suunniteltuPvm}</div>
                  )}
                  {t.tehtyPvm && <div>✅ Tehty: {t.tehtyPvm}</div>}
                  {overdue && (
                    <div style={{ color: "#d32f2f" }}>⚠ Myöhässä</div>
                  )}
                  {isOpen && t.kuvaus && <div>{t.kuvaus}</div>}

                  <button onClick={() => startEdit(t)}>Muokkaa</button>
                  <button onClick={() => deleteToimenpide(t.id)}>Poista</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
