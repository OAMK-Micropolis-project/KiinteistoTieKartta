
import { useState } from "react";
import type { Kiinteisto, Toimenpide } from "../../types";
import ToimenpideModal from "../ToimenpideModal";
import { isOverdue, sortByPlannedDate } from "../../utils/kiinteistoUtils";
import {
  cardStyle,
  sectionTitle,
} from "../../styles";
import { ErrorBoundary } from "../ErrorBoundary";

/**
 * ToimenpiteetTab
 * ----------------
 * Shows all actions (toimenpiteet) for a single Kiinteistö.
 * Uses ONE shared modal for:
 *  - Adding a new toimenpide
 *  - Editing an existing toimenpide
 */

interface Props {
  item: Kiinteisto;
  onUpdate: (updated: Kiinteisto) => void;
}

export default function ToimenpiteetTab({ item, onUpdate }: Props) {
  /** Which toimenpide is currently being edited (null = none) */
  const [editing, setEditing] = useState<Toimenpide | null>(null);

  /** Controls the "Add new" modal */
  const [showAddModal, setShowAddModal] = useState(false);

  /** Simple feedback message after save */
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [openDescriptionId, setOpenDescriptionId] =
    useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────

  /** Add new toimenpide */
  function handleAdd(newItem: Toimenpide) {
    onUpdate({
      ...item,
      toimenpiteet: [...item.toimenpiteet, newItem],
    });

    setShowAddModal(false);
    setSaveMessage("Toimenpide tallennettu");
    setTimeout(() => setSaveMessage(null), 2000);
  }

  /** Save edited toimenpide */
  function handleEdit(updated: Toimenpide) {
    onUpdate({
      ...item,
      toimenpiteet: item.toimenpiteet.map((t) =>
        t.id === updated.id ? updated : t
      ),
    });

    setEditing(null);
  }

  /** Delete toimenpide */
  function handleDelete(id: string) {
    onUpdate({
      ...item,
      toimenpiteet: item.toimenpiteet.filter((t) => t.id !== id),
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <ErrorBoundary>
      <div style={cardStyle}>
        {/* Header */}
        <h3 style={sectionTitle}>Toimenpiteet</h3>

        {/* Add button */}
        <button onClick={() => setShowAddModal(true)}>
          Lisää toimenpide
        </button>

        {/* Feedback */}
        {saveMessage && <div>✅ {saveMessage}</div>}

        {/* Empty state */}
        {item.toimenpiteet.length === 0 && (
          <p>Ei kirjattuja toimenpiteitä.</p>
        )}

        {/* List */}
        {[...item.toimenpiteet]
          .sort(sortByPlannedDate)
          .map((t) => {
            const overdue = isOverdue(t);

            return (
              <div key={t.id} style={{ border: "1px solid #ccc", padding: 8, borderRadius: 4, margin: "8px 0" }}>

                <strong>{t.otsikko}</strong>

                <div>Kustannus: {t.kustannukset} €</div>

                {t.suunniteltuPvm && (
                  <div>Suunniteltu: {t.suunniteltuPvm}</div>
                )}

                {t.tehtyPvm && (
                  <div>✅ Tehty: {t.tehtyPvm}</div>
                )}

                {overdue && (
                  <div style={{ color: "#d32f2f" }}>⚠ Myöhässä</div>
                )}


                <button
                  onClick={() =>
                    setOpenDescriptionId(
                      openDescriptionId === t.id ? null : t.id
                    )
                  }
                  disabled={!t.kuvaus}
                >
                  {openDescriptionId === t.id
                    ? "Piilota kuvaus"
                    : "Näytä kuvaus"}
                </button>

                {openDescriptionId === t.id && t.kuvaus && (
                  <p>{t.kuvaus}</p>
                )}

                {/* Actions */}
                <button onClick={() => setEditing(t)}>Muokkaa</button>
                <button onClick={() => handleDelete(t.id)}>Poista</button>
              </div>
            );
          })}

        {/* Add modal */}
        {
          showAddModal && (
            <ToimenpideModal
              mode="add"
              onClose={() => setShowAddModal(false)}
              onSave={handleAdd}
            />
          )
        }

        {/* Edit modal */}
        {
          editing && (
            <ToimenpideModal
              mode="edit"
              initial={editing}
              onClose={() => setEditing(null)}
              onSave={handleEdit}
            />
          )
        }
      </div >
    </ErrorBoundary>
  );
}
