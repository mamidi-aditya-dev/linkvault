import LinkCard from './LinkCard';

export default function LinksGrid({ links, onEdit, onDelete, emptyMessage = 'No links here yet' }) {
  if (!links.length) {
    return (
      <div className="empty-state">
        <div className="icon">🔗</div>
        <h3>{emptyMessage}</h3>
        <p>Add links using the + Add Link button</p>
      </div>
    );
  }
  return (
    <div style={styles.grid}>
      {links.map(link => (
        <LinkCard key={link.id} link={link} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 },
};
